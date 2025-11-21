using System;
using System.Collections.Generic;

namespace Releaf.API.Models;

public partial class User
{
    public int UserId { get; set; }

    public string? FullName { get; set; }

    public DateTime? BirthDate { get; set; }

    public string? Address { get; set; }

    public string? Email { get; set; }

    public string? PasswordHash { get; set; }

    public string? Phone { get; set; }

    public DateTime? CreateAt { get; set; } = DateTime.UtcNow;

    public virtual ICollection<Order> Orders { get; set; } = new List<Order>();

    public virtual ICollection<Role> Roles { get; set; } = new List<Role>();
}
