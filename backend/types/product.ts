import { Document } from "mongoose";
import mongoose from "mongoose";

// ✅ Product Interface cho Mongoose Document
export interface IProduct extends Document {
  name: string;
  description: string;
  price: number;
  image?: string;
  category?: string;
  inStock: boolean;
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

// ✅ DTO cho Create Product (data từ client gửi lên)
export interface CreateProductDTO {
  name: string;
  description: string;
  price: number;
  image?: string;
  category?: string;
  inStock?: boolean;
}

// ✅ DTO cho Update Product
export interface UpdateProductDTO {
  name?: string;
  description?: string;
  price?: number;
  image?: string;
  category?: string;
  inStock?: boolean;
}

// ✅ Response Product (trả về client, bao gồm cả populated user)
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