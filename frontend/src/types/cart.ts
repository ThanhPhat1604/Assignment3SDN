import { IProduct } from "./product";

/**
 * ✅ Dòng sản phẩm trong giỏ hàng (khi backend đã populate)
 * productId là object đầy đủ chứa thông tin sản phẩm.
 */
export interface CartItem {
  _id: string;
  productId: IProduct; // Được populate từ backend
  quantity: number;
}

/**
 * ✅ Dữ liệu trả về từ backend
 */
export interface CartResponse {
  _id?: string;
  userId?: string;
  items: CartItem[];
}

/**
 * ✅ Cấu trúc giỏ hàng cục bộ (frontend)
 * - tổng tiền được tính ở client
 */
export interface Cart {
  items: {
    productId: string;   // ID sản phẩm (đơn giản hóa cho frontend)
    name: string;
    price: number;
    quantity: number;
    image?: string;
  }[];
  total: number;
}
