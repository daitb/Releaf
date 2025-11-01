create database ReleafDb
go

use ReleafDb
go

create table Suppliers(
	SupplierId int primary key identity(1, 1),
	NameSupplier nvarchar(255),
	Story ntext,
	LogoUrl nvarchar(500)
)

go
create table Categories(
	CategoryId int primary key identity(1, 1),
	CategoryName nvarchar(255),
	ParentId int
)

go
create table Products(
	ProductId int primary key identity(1, 1),
	ProductName nvarchar(255),
	Description ntext,
	ProductStatus nvarchar(50) default 'Available',
	Price decimal(10, 2) check(Price >= 0),
	Materials nvarchar(500),
	SupplierId int,
	CategoryId int,
	PublishAt datetime2,
	CreateAt datetime2 default getdate(),
	UpdateAt datetime2,

	constraint FK_Product_Categories foreign key (CategoryId) references Categories(CategoryId) on delete no action,
	--AN TOÀN: Không cho xóa danh mục nếu vẫn còn sản phẩm trong đó. Buộc người dùng phải chuyển sản phẩm sang danh mục khác trước.
	constraint FK_Product_Suppliers foreign key (SupplierId) references Suppliers (SupplierId) on delete set null,
	--YÊU CẦU: Nếu nhà cung cấp bị xóa, sản phẩm vẫn tồn tại nhưng không thuộc về ai.
	constraint CK_Products_Status check (ProductStatus in ('Available', 'Unavailable', 'Discontinued'))
)

create table ProductImages(
	ProductImageId int primary key identity(1, 1),
	ProductId int,
	ImageUrl nvarchar(500),
	AltText nvarchar(255),
	IsPrimary bit default 0,

	constraint FK_ProductImages_Products foreign key (ProductId) references Products(ProductId) on delete cascade
	--HỢP LÝ: Nếu sản phẩm bị xóa, tất cả hình ảnh của nó cũng nên bị xóa theo.
)

create table Users(
	UserId int primary key identity(1, 1),
	FullName nvarchar(255),
	BirthDate datetime2 check (BirthDate < getdate()),
	Address nvarchar(500),
	Email nvarchar(255),
	PassWordHash nvarchar(255),
	Phone nvarchar(20),
	CreateAt datetime2 default getdate()
)

create table Roles(
	RoleId int primary key identity(1, 1),
	RoleName nvarchar(100)
)

create table UserRole(
	UserId int,
	RoleId int,

	constraint PK_UserRole primary key (UserId, RoleId),
	constraint FK_UserRole_Roles foreign key (RoleId) references Roles (RoleId) on delete cascade,
	--HỢP LÝ: Nếu một vai trò bị xóa (ví dụ: 'Moderator'), các liên kết của người dùng với vai trò đó cũng nên bị xóa.
	constraint FK_UserRole_Users foreign key (UserId) references Users (UserId) on delete cascade
	--HỢP LÝ: Nếu người dùng bị xóa, các vai trò của họ cũng nên bị xóa theo.
)

create table Orders(
	OrderId int primary key identity(1, 1),
	UserId int,
	TotalAmount decimal(10, 2),
	OrderDate datetime2 default getdate(),
	StatusOrder nvarchar(50),
	ShippingFee decimal(10, 2),
	ShippingAddress nvarchar(500),
	PaymentMethod nvarchar(255),
	PaymentStatus nvarchar(50),

	constraint FK_Orders_Users foreign key (UserId) references Users(UserId) on delete set null
	-- HỢP LÝ: Nếu một người dùng xóa tài khoản, các đơn hàng cũ của họ vẫn được giữ lại cho mục đích thống kê, nhưng không còn liên kết với người dùng đó nữa.
)

create table OrderDetails(
	OrderDetailId int primary key identity(1, 1),
	OrderId int,
	ProductId int,
	Quantity int,
	PriceAtPurchase decimal(10, 2),

	constraint FK_OrderDetails_Orders foreign key (OrderId) references Orders(OrderId) on delete cascade,
	--HỢP LÝ: Nếu đơn hàng bị xóa, tất cả chi tiết của đơn hàng đó phải bị xóa theo.
	constraint FK_OrderDetails_Products foreign key (ProductId) references Products (ProductId) on delete no action
	-- CỰC KỲ QUAN TRỌNG: Không bao giờ cho phép xóa một sản phẩm nếu nó đã từng xuất hiện trong một đơn hàng, để bảo toàn lịch sử bán hàng.
)

