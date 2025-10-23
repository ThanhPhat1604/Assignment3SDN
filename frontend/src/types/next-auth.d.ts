import { Document } from "mongoose";

// ✅ User Interface cho Mongoose Document
export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  role: "admin" | "user";
  image?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// ✅ DTO cho Register
export interface RegisterDTO {
  name: string;
  email: string;
  password: string;
  role?: "admin" | "user";
}

// ✅ DTO cho Login
export interface LoginDTO {
  email: string;
  password: string;
}

// ✅ JWT Payload
export interface JWTPayload {
  id: string;
  role: "admin" | "user";
  iat?: number;
  exp?: number;
}

// ✅ Auth Response
export interface AuthResponse {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: "admin" | "user";
    image?: string;
  };
}

// ✅ User Response (public info only)
export interface UserResponse {
  id: string;
  name: string;
  email: string;
  role: "admin" | "user";
  image?: string;
}