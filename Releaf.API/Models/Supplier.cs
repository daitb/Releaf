using System;
using System.Collections.Generic;

namespace Releaf.API.Models;

public partial class Supplier
{
    public int SupplierId { get; set; }

    public string? NameSupplier { get; set; }

    public string? Story { get; set; }

    public string? LogoUrl { get; set; }

    public virtual ICollection<Product> Products { get; set; } = new List<Product>();
}
