using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage;
using Releaf.API.Data;
using Releaf.API.Interfaces;

namespace Releaf.API.Repositories
{
    /// <summary>
    /// Unit of Work implementation using Entity Framework Core.
    /// 
    /// IMPLEMENTATION NOTES:
    /// - Repositories are created lazily (only when accessed)
    /// - All repositories share the same DbContext instance
    /// - SaveChangesAsync commits all changes in a single transaction
    /// - Supports explicit transactions for complex operations
    /// </summary>
    public class UnitOfWork : IUnitOfWork
    {
        private readonly ReleafDbContext _context;
        private IDbContextTransaction? _currentTransaction;

        // Lazy-loaded repositories
        private IProductRepository? _products;
        private IOrderDetailRepository? _orderDetails;
        private IUserRepository? _users;
        private IRoleRepository? _roles;

        public UnitOfWork(ReleafDbContext context)
        {
            _context = context;
        }

        /// <summary>
        /// Gets the Product repository.
        /// Uses lazy initialization - only creates the repository when first accessed.
        /// 
        /// WHY LAZY?
        /// Not all operations need all repositories.
        /// Lazy loading avoids unnecessary object creation.
        /// </summary>
        public IProductRepository Products =>
            _products ??= new ProductRepository(_context);

        public IOrderDetailRepository OrderDetails =>
            _orderDetails ??= new OrderDetailRepository(_context);

        public IUserRepository Users =>
            _users ??= new UserRepository(_context);

        public IRoleRepository Roles =>
            _roles ??= new RoleRepository(_context);

        /// <summary>
        /// Saves all changes to the database.
        /// This is the SINGLE point where changes are committed.
        /// </summary>
        public async Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
        {
            return await _context.SaveChangesAsync(cancellationToken);
        }

        /// <summary>
        /// Begins a new database transaction.
        /// Use when you need explicit control over transaction boundaries.
        /// 
        /// EXAMPLE:
        ///     await _unitOfWork.BeginTransactionAsync();
        ///     try {
        ///         // Multiple operations...
        ///         await _unitOfWork.SaveChangesAsync();
        ///         await _unitOfWork.CommitTransactionAsync();
        ///     } catch {
        ///         await _unitOfWork.RollbackTransactionAsync();
        ///         throw;
        ///     }
        /// </summary>
        public async Task BeginTransactionAsync(CancellationToken cancellationToken = default)
        {
            if (_currentTransaction != null)
            {
                throw new InvalidOperationException("A transaction is already in progress.");
            }
            _currentTransaction = await _context.Database.BeginTransactionAsync(cancellationToken);
        }

        public async Task CommitTransactionAsync(CancellationToken cancellationToken = default)
        {
            if (_currentTransaction == null)
            {
                throw new InvalidOperationException("No transaction in progress.");
            }

            try
            {
                await _currentTransaction.CommitAsync(cancellationToken);
            }
            finally
            {
                await _currentTransaction.DisposeAsync();
                _currentTransaction = null;
            }
        }

        public async Task RollbackTransactionAsync(CancellationToken cancellationToken = default)
        {
            if (_currentTransaction == null)
            {
                throw new InvalidOperationException("No transaction in progress.");
            }

            try
            {
                await _currentTransaction.RollbackAsync(cancellationToken);
            }
            finally
            {
                await _currentTransaction.DisposeAsync();
                _currentTransaction = null;
            }
        }

        /// <summary>
        /// Disposes the DbContext and transaction.
        /// Called automatically when using 'using' statement or DI scope ends.
        /// </summary>
        public void Dispose()
        {
            _currentTransaction?.Dispose();
            _context.Dispose();
            GC.SuppressFinalize(this);
        }
    }
}
