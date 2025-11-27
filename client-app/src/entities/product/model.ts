export interface Product {
  productId: number;
  productName: string;
  description: string;
  price: number;
  materials: string;
  categoryName: string;
  supplierName: string;
  imageUrl?: string;
  images?: string[];
  stockQuantity?: number;
  rating?: number;
  reviewCount?: number;
  publishAt?: string;
  productStatus?: 'Available' | 'Unavailable' | 'Discontinue';
}
