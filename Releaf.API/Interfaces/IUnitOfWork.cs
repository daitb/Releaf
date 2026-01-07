namespace Releaf.API.Interfaces
{
    /// <summary>
    /// Unit of Work pattern - coordinates multiple repositories within a single transaction.
    /// 
    /// WHY UNIT OF WORK?
    /// 
    /// PROBLEM:
    /// Before, each repository had its own SaveChangesAsync() method.
    /// If you needed to update Product AND create Order in one transaction:
    ///     await _productRepo.UpdateStockAsync(product);
    ///     await _productRepo.SaveChangesAsync();  // Transaction 1
    ///     await _orderRepo.AddAsync(order);
    ///     await _orderRepo.SaveChangesAsync();    // Transaction 2 - PROBLEM!
    /// 
    /// If Transaction 2 fails, Transaction 1 already committed - data inconsistent!
    /// 
    /// SOLUTION - Unit of Work:
    ///     await _unitOfWork.Products.UpdateStockAsync(product);
    ///     await _unitOfWork.Orders.AddAsync(order);
    ///     await _unitOfWork.SaveChangesAsync();   // Single transaction - ALL or NOTHING
    /// 
    /// INTERVIEW TIP:
    /// "Unit of Work đảm bảo tính toàn vẹn dữ liệu (data integrity) bằng cách 
    ///  gom tất cả thay đổi vào một transaction duy nhất."
    /// </summary>
    public interface IUnitOfWork : IDisposable
    {
        /// <summary>
        /// Product repository
        /// </summary>
        IProductRepository Products { get; }

        /// <summary>
        /// Order repository (when implemented)
        /// </summary>
        // IOrderRepository Orders { get; }

        /// <summary>
        /// OrderDetail repository
        /// </summary>
        IOrderDetailRepository OrderDetails { get; }

        /// <summary>
        /// User repository
        /// </summary>
        IUserRepository Users { get; }

        /// <summary>
        /// Role repository
        /// </summary>
        IRoleRepository Roles { get; }

        /// <summary>
        /// Saves all changes made in this unit of work to the database.
        /// Returns the number of affected rows.
        /// </summary>
        Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);

        /// <summary>
        /// Begins a database transaction explicitly.
        /// Use for complex operations that need explicit transaction control.
        /// </summary>
        Task BeginTransactionAsync(CancellationToken cancellationToken = default);

        /// <summary>
        /// Commits the current transaction.
        /// </summary>
        Task CommitTransactionAsync(CancellationToken cancellationToken = default);

        /// <summary>
        /// Rolls back the current transaction.
        /// </summary>
        Task RollbackTransactionAsync(CancellationToken cancellationToken = default);
    }
}
