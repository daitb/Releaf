using System;
using System.Collections.Generic;

namespace Releaf.API.Models;

public enum ProductStatus
{
    Available,
    Unavailable,
    Discontinue
}

public partial class Product
{
    public int ProductId { get; set; }

    public string? ProductName { get; set; }

    public string? Description { get; set; }

    public decimal? Price { get; set; }

    public string? Materials { get; set; }

    public int? SupplierId { get; set; }

    public int? CategoryId { get; set; }

    public DateTime? PublishAt { get; set; }

    public DateTime? CreateAt { get; set; }

    public DateTime? UpdateAt { get; set; }

    public ProductStatus ProductStatus { get; set; }

    public virtual Category? Category { get; set; }

    public virtual ICollection<OrderDetail> OrderDetails { get; set; } = new List<OrderDetail>();

    public virtual ICollection<ProductImage> ProductImages { get; set; } = new List<ProductImage>();

    public virtual Supplier? Supplier { get; set; }
}
