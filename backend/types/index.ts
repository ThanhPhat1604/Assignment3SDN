// ============== USER TYPES ==============
export type {
    IUser,
    RegisterDTO,
    LoginDTO,
    JWTPayload,
    AuthResponse,
    UserResponse,
} from "./next-auth.js";

export type {
    IProduct,
    CreateProductDTO,
    UpdateProductDTO,
    ProductResponse,
  } from "./product.js";
  
  // ============== REQUEST TYPES ==============
  import { Request } from "express";
  import { JWTPayload } from "./next-auth.js";
  
  // ✅ Extended Request với user info từ JWT
  export interface AuthRequest extends Request {
    user?: JWTPayload;
  }
  
  // ============== API RESPONSE TYPES ==============
  export interface ApiSuccessResponse<T = any> {
    success: true;
    message?: string;
    data?: T;
  }
  
  export interface ApiErrorResponse {
    success: false;
    message: string;
    errors?: any[];
  }
  
  export type ApiResponse<T = any> = ApiSuccessResponse<T> | ApiErrorResponse;
  
  // ============== PAGINATION TYPES ==============
  export interface PaginationQuery {
    page?: string;
    limit?: string;
    search?: string;
    sortBy?: string;
    order?: "asc" | "desc";
  }
  
  export interface PaginationResult<T> {
    data: T[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      pages: number;
    };
  }