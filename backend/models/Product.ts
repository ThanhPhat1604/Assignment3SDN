import mongoose, { Schema } from "mongoose";
import { IProduct } from "../types"; // ✅ Import từ types

const productSchema = new Schema<IProduct>(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
      maxlength: [100, "Product name cannot exceed 100 characters"],
    },
    description: {
      type: String,
      required: [true, "Product description is required"],
      maxlength: [1000, "Description cannot exceed 1000 characters"],
    },
    price: {
      type: Number,
      required: [true, "Product price is required"],
      min: [0, "Price must be a positive number"],
    },
    image: {
      type: String,
      default: "https://via.placeholder.com/400x300?text=No+Image",
    },
    category: {
      type: String,
      default: "General",
    },
    inStock: {
      type: Boolean,
      default: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Index for search performance
productSchema.index({ name: "text", description: "text" });

const Product =
  mongoose.models.Product || mongoose.model<IProduct>("Product", productSchema);

export default Product;