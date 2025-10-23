import { Document, Types } from "mongoose";

/**
 * Interface cho MongoDB document (server-side)
 */
export interface IProduct extends Document {
  _id: string;
  name: string;
  description: string;
  price: number;
  image?: string;
  category?: string;
  inStock: boolean;
  createdBy: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * DTO khi client gửi yêu cầu tạo sản phẩm
 */
export interface CreateProductDTO {
  name: string;
  description: string;
  price: number;
  image?: string;
  category?: string;
  inStock?: boolean;
}

/**
 * DTO khi client cập nhật sản phẩm
 */
export interface UpdateProductDTO {
  name?: string;
  description?: string;
  price?: number;
  image?: string;
  category?: string;
  inStock?: boolean;
}

/**
 * Dữ liệu trả về client (đã populate user)
 */
export interface ProductResponse {
  _id: string;
  name: string;
  description: string;
  price: number;
  image?: string;
  category?: string;
  inStock: boolean;
  createdBy: {
    _id: string;
    name: string;
    email: string;
    image?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Dạng rút gọn (frontend thường dùng trong Cart hoặc ProductList)
 */
export interface SimpleProduct {
  _id: string;
  name: string;
  price: number;
  image?: string;
  category?: string;
}
