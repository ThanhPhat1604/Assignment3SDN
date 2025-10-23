import { IProduct } from "./product";

export interface OrderItem {
  productId: IProduct; // ✅ đã populate thành object
  quantity: number;
}

export interface Order {
  _id: string;
  userId?: string;
  products: OrderItem[];
  totalAmount: number;
  status: string;
  createdAt?: string;
  updatedAt?: string;
}
