import { Response } from "express";
import Product from "../models/Product";
import {
  AuthRequest,
  CreateProductDTO,
  UpdateProductDTO,
  PaginationQuery,
} from "../types"; // ✅ Import types

// ---------------- GET ALL PRODUCTS (Public) ----------------
export const getProducts = async (req: AuthRequest, res: Response) => {
  try {
    const { search, page = "1", limit } = req.query as PaginationQuery;

    const pageNum = parseInt(page);
    const limitNum = limit? parseInt(limit) : 0;
    const skip = (pageNum - 1) * limitNum;

    // Build query
    const query: any = {};
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    const [products, total] = await Promise.all([
      Product.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum || 0)
        .populate("createdBy", "name email image"),
      Product.countDocuments(query),
    ]);

    res.json({
      success: true,
      products,
      pagination: {
        page: pageNum,
        limit: limitNum || total, // If no limit, show all
        total,
        pages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    console.error("❌ Get products error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error,
    });
  }
};

// ---------------- GET SINGLE PRODUCT (Public) ----------------
export const getProductById = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id).populate(
      "createdBy",
      "name email image"
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.json({
      success: true,
      product,
    });
  } catch (error) {
    console.error("❌ Get product error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error,
    });
  }
};

// ---------------- CREATE PRODUCT (Protected) ----------------
export const createProduct = async (req: AuthRequest, res: Response) => {
  try {
    const { name, description, price, image, category, inStock } =
      req.body as CreateProductDTO;

    // ✅ Validation
    if (!name || !description || price === undefined) {
      return res.status(400).json({
        success: false,
        message: "Please provide name, description, and price",
      });
    }

    if (price < 0) {
      return res.status(400).json({
        success: false,
        message: "Price must be a positive number",
      });
    }

    // ✅ Create product
    const product = new Product({
      name,
      description,
      price,
      image: image || "https://via.placeholder.com/400x300?text=No+Image",
      category: category || "General",
      inStock: inStock ?? true,
      createdBy: req.user!.id,
    });

    await product.save();
    await product.populate("createdBy", "name email");

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      product,
    });
  } catch (error) {
    console.error("❌ Create product error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error,
    });
  }
};

// ---------------- UPDATE PRODUCT (Protected) ----------------
export const updateProduct = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const updateData = req.body as UpdateProductDTO;

    // ✅ Find product
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // ✅ Check ownership
    const isOwner = product.createdBy.toString() === req.user!.id;
    const isAdmin = req.user!.role === "admin";

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to update this product",
      });
    }

    // ✅ Update product
    const updatedProduct = await Product.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    }).populate("createdBy", "name email");

    res.json({
      success: true,
      message: "Product updated successfully",
      product: updatedProduct,
    });
  } catch (error) {
    console.error("❌ Update product error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error,
    });
  }
};

// ---------------- DELETE PRODUCT (Protected) ----------------
export const deleteProduct = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    // ✅ Find product
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // ✅ Check ownership
    const isOwner = product.createdBy && req.user && product.createdBy.toString() === req.user!.id;
    const isAdmin = req.user!.role === "admin";

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to delete this product",
      });
    }

    await Product.findByIdAndDelete(id);

    res.json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.error("❌ Delete product error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error,
    });
  }
}