export interface Product {
  productId: number;
  productName: string;
  description: string;
  price: number;
  materials: string;
  categoryName: string;
  supplierName: string;
  imageUrl?: string; // optional nếu chưa có trong backend
}
