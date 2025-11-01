/*
---------------------------------------------
SỬ DỤNG DATABASE
---------------------------------------------
*/
USE ReleafDb
GO

/*
---------------------------------------------
1. BẢNG KHÔNG CÓ PHỤ THUỘC (Hoặc phụ thuộc cơ bản)
---------------------------------------------
*/

-- Suppliers: Các nhà cung cấp sản phẩm xanh
INSERT INTO Suppliers (NameSupplier, Story, LogoUrl)
VALUES 
(
    N'GreenVibe Solutions', 
    N'GreenVibe bắt đầu từ một nhóm kỹ sư môi trường với mong muốn giảm rác thải nhựa. Chúng tôi cung cấp các giải pháp thay thế bền vững cho đồ dùng hàng ngày, giúp giảm lượng khí CO2 từ việc sản xuất và phân hủy nhựa.', 
    '/images/logos/greenvibe.png'
),
(
    N'EcoCycles Việt Nam', 
    N'Chúng tôi tin vào vòng tuần hoàn. EcoCycles chuyên thu gom và tái chế chai PET, vải vụn... để tạo ra các sản phẩm thời trang và gia dụng. Mỗi sản phẩm là một minh chứng cho việc rác thải có thể có "cuộc đời thứ hai".', 
    '/images/logos/ecocycles.png'
),
(
    N'Bambusa', 
    N'Tre là vật liệu của tương lai. Bambusa làm việc với các nghệ nhân làng nghề để tạo ra các sản phẩm tre không chỉ đẹp mà còn có khả năng tự phân hủy, giúp giảm gánh nặng cho bãi rác.', 
    '/images/logos/bambusa.png'
);
GO

-- Categories: Phân loại sản phẩm
-- (ID 1, 2, 3 là danh mục cha)
INSERT INTO Categories (CategoryName, ParentId)
VALUES 
(N'Đồ dùng cá nhân', NULL),         -- ID 1
(N'Nhà cửa & Đời sống', NULL),      -- ID 2
(N'Thời trang bền vững', NULL),    -- ID 3
-- (Các danh mục con)
(N'Chăm sóc cơ thể', 1),            -- ID 4 (Con của 1)
(N'Đồ dùng nhà bếp', 2),             -- ID 5 (Con của 2)
(N'Vệ sinh nhà cửa', 2),              -- ID 6 (Con của 2)
(N'Túi xách tái chế', 3);            -- ID 7 (Con của 3)
GO

-- Roles: Vai trò người dùng
INSERT INTO Roles (RoleName)
VALUES 
(N'Admin'),                         -- ID 1
(N'Customer');                      -- ID 2
GO

-- Users: Người dùng
INSERT INTO Users (FullName, BirthDate, Address, Email, PassWordHash, Phone)
VALUES 
(
    N'Admin Releaf', 
    '1990-01-01', 
    N'123 Rừng Xanh, Q.1, TP.HCM', 
    'admin@releaf.com', 
    'AQAAAAEAACcQAAAAEP...YOUR_HASHED_PASSWORD...1', -- (Đây là chuỗi hash mẫu)
    '0900000001'
),
(
    N'Nguyễn Văn Xanh', 
    '1995-05-15', 
    N'456 Đất Mẹ, Q. Cầu Giấy, Hà Nội', 
    'xanh.nguyen@email.com', 
    'AQAAAAEAACcQAAAAEP...YOUR_HASHED_PASSWORD...2', 
    '0912345678'
),
(
    N'Trần Thị Môi Trường', 
    '2000-11-30', 
    N'789 Biển Sạch, Q. Sơn Trà, Đà Nẵng', 
    'moitruong.tran@email.com', 
    'AQAAAAEAACcQAAAAEP...YOUR_HASHED_PASSWORD...3', 
    '0987654321'
);
GO

-- UserRole: Phân quyền
INSERT INTO UserRole (UserId, RoleId)
VALUES 
(1, 1), -- Admin Releaf là Admin
(2, 2), -- Nguyễn Văn Xanh là Customer
(3, 2); -- Trần Thị Môi Trường là Customer
GO

/*
---------------------------------------------
2. BẢNG PHỤ THUỘC CẤP 1 (Products, ProductImages)
---------------------------------------------
*/

-- Products: Các sản phẩm
INSERT INTO Products (ProductName, Description, ProductStatus, Price, Materials, SupplierId, CategoryId, PublishAt, UpdateAt)
VALUES 
(
    N'Bàn chải tre Bambusa', 
    N'Thay thế bàn chải nhựa truyền thống. Thân tre 100% tự nhiên, có khả năng phân hủy sinh học. Lông bàn chải làm từ sợi nylon-4 (phân hủy được), không chứa BPA.', 
    'Available', 
    35000.00, 
    N'Tre tự nhiên, Sợi Nylon-4', 
    3, -- Supplier: Bambusa (ID 3)
    4, -- Category: Chăm sóc cơ thể (ID 4)
    '2025-10-01 10:00:00',
    NULL
),
(
    N'Túi tote vải bố tái chế EcoCycles', 
    N'Được may từ vải bố canvas tái chế (tương đương 5 chai PET 500ml). Bền bỉ, thời trang và giúp giảm rác thải nhựa ra đại dương.', 
    'Available', 
    150000.00, 
    N'Vải bố (canvas) tái chế từ chai PET', 
    2, -- Supplier: EcoCycles (ID 2)
    7, -- Category: Túi xách tái chế (ID 7)
    '2025-10-02 11:00:00',
    NULL
),
(
    N'Bộ ống hút inox GreenVibe (4 ống + cọ rửa)', 
    N'Nói không với ống hút nhựa. Bộ sản phẩm làm từ thép không gỉ 304 an toàn cho thực phẩm, dùng trọn đời. Kèm túi vải bố và cọ rửa xơ dừa.', 
    'Available', 
    80000.00, 
    N'Thép không gỉ 304, Xơ dừa, Vải bố', 
    1, -- Supplier: GreenVibe (ID 1)
    5, -- Category: Đồ dùng nhà bếp (ID 5)
    '2025-10-03 14:30:00',
    NULL
),
(
    N'Xà phòng handmade (Bồ hòn & Oải hương)', 
    N'Xà phòng tự nhiên không chứa hóa chất công nghiệp, không gây ô nhiễm nguồn nước. Nước bồ hòn làm sạch dịu nhẹ, tinh dầu oải hương thư giãn.', 
    'Available', 
    65000.00, 
    N'Nước bồ hòn, Dầu dừa, Dầu olive, Tinh dầu oải hương', 
    1, -- Supplier: GreenVibe (ID 1)
    4, -- Category: Chăm sóc cơ thể (ID 4)
    '2025-10-05 09:00:00',
    NULL
),
(
    N'Ly/Cốc tre tự nhiên', 
    N'Ly uống nước làm thủ công từ tre. Giữ nhiệt tốt và mang lại trải nghiệm gần gũi với thiên nhiên. (Sản phẩm đang tạm hết hàng)', 
    'Unavailable', 
    50000.00, 
    N'Tre tự nhiên', 
    3, -- Supplier: Bambusa (ID 3)
    5, -- Category: Đồ dùng nhà bếp (ID 5)
    '2025-10-01 10:00:00',
    '2025-10-28 17:00:00'
);
GO
-- DBCC CHECKIDENT ('Products', RESEED, 0)
-- ProductImages: Hình ảnh cho sản phẩm
INSERT INTO ProductImages (ProductId, ImageUrl, AltText, IsPrimary)
VALUES
-- Sản phẩm 1: Bàn chải tre (ID 1)
(1, '/images/products/banchai_tre_1.jpg', N'Bàn chải tre từ nhiều góc độ', 1),
(1, '/images/products/banchai_tre_2.jpg', N'Cận cảnh lông bàn chải tre', 0),
(1, '/images/products/banchai_tre_3.jpg', N'Bàn chải tre trong hộp giấy tái chế', 0),
-- Sản phẩm 2: Túi tote (ID 2)
(2, '/images/products/tui_tote_1.jpg', N'Túi tote tái chế màu be', 1),
(2, '/images/products/tui_tote_2.jpg', N'Người mẫu đeo túi tote vải bố', 0),
-- Sản phẩm 3: Ống hút inox (ID 3)
(3, '/images/products/onghut_inox_1.jpg', N'Bộ ống hút inox kèm cọ rửa và túi vải', 1),
(3, '/images/products/onghut_inox_2.jpg', N'Ống hút inox trong ly nước chanh', 0),
-- Sản phẩm 4: Xà phòng (ID 4)
(4, '/images/products/xaphong_1.jpg', N'Bánh xà phòng oải hương và bồ hòn', 1);
GO

/*
---------------------------------------------
3. BẢNG PHỤ THUỘC CẤP 2 (Orders, OrderDetails)
---------------------------------------------
*/

-- Orders: Đơn hàng
INSERT INTO Orders (UserId, TotalAmount, OrderDate, StatusOrder, ShippingFee, ShippingAddress, PaymentMethod, PaymentStatus)
VALUES
(
    2, -- UserId: Nguyễn Văn Xanh (ID 2)
    170000.00, -- (Tạm tính: 2*35k + 1*80k = 150k + 20k ship)
    '2025-10-25 09:30:15', 
    'Completed', 
    20000.00, 
    N'456 Đất Mẹ, Q. Cầu Giấy, Hà Nội', 
    'COD', 
    'Paid'
),
(
    3, -- UserId: Trần Thị Môi Trường (ID 3)
    305000.00, -- (Tạm tính: 1*150k + 2*65k = 280k + 25k ship)
    '2025-10-30 14:05:00', 
    'Processing', 
    25000.00, 
    N'789 Biển Sạch, Q. Sơn Trà, Đà Nẵng', 
    'VNPAY', 
    'Paid'
),
(
    2, -- UserId: Nguyễn Văn Xanh (ID 2)
    100000.00, -- (Tạm tính: 1*80k + 20k ship)
    '2025-10-31 11:15:00', 
    'Cancelled', 
    20000.00, 
    N'456 Đất Mẹ, Q. Cầu Giấy, Hà Nội', 
    'COD', 
    'Unpaid'
);
GO

-- OrderDetails: Chi tiết đơn hàng
INSERT INTO OrderDetails (OrderId, ProductId, Quantity, PriceAtPurchase)
VALUES
-- Chi tiết Đơn hàng 1 (ID 1)
(
    1, -- OrderId 1
    1, -- ProductId 1 (Bàn chải tre)
    2, -- Quantity
    35000.00 -- Giá tại thời điểm mua
),
(
    1, -- OrderId 1
    3, -- ProductId 3 (Ống hút inox)
    1, 
    80000.00
),
-- Chi tiết Đơn hàng 2 (ID 2)
(
    2, -- OrderId 2
    2, -- ProductId 2 (Túi tote)
    1, 
    150000.00
),
(
    2, -- OrderId 2
    4, -- ProductId 4 (Xà phòng)
    2, 
    65000.00
);
-- Lưu ý: Đơn hàng 3 (ID 3) bị hủy nên không có chi tiết đơn hàng (hoặc đã bị xóa/không được thêm vào)
-- Hoặc chúng ta có thể thêm chi tiết cho đơn hàng bị hủy
INSERT INTO OrderDetails (OrderId, ProductId, Quantity, PriceAtPurchase)
VALUES
(
    3, -- OrderId 3
    3, -- ProductId 3 (Ống hút inox)
    1, 
    80000.00
);
GO