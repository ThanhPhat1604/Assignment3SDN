import { Request, Response } from "express";
import Cart from "../models/Cart";
import Product from "../models/Product";

/**
 * Lấy giỏ hàng của user
 */
export const getCart = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const cart = await Cart.findOne({ userId }).populate("items.productId");

    if (!cart) return res.json({ items: [] });
    res.json(cart);
  } catch (err) {
    res.status(500).json({ message: "Error fetching cart", error: err });
  }
};

/**
 * Thêm sản phẩm vào giỏ hàng
 */
export const addToCart = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const { productId, quantity } = req.body;

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    let cart = await Cart.findOne({ userId });
    if (!cart) {
      cart = new Cart({ userId, items: [] });
    }

    const existingItem = cart.items.find(
      (item) => item.productId.toString() === productId
    );

    if (existingItem) {
      existingItem.quantity += quantity || 1;
    } else {
      cart.items.push({ productId, quantity: quantity || 1 });
    }

    await cart.save();
    const updatedCart = await cart.populate("items.productId");

    res.json(updatedCart);
  } catch (err) {
    res.status(500).json({ message: "Error adding to cart", error: err });
  }
};

/**
 * Cập nhật số lượng 1 sản phẩm trong giỏ
 */
export const updateCartItem = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const { productId } = req.params;
    const { quantity } = req.body;

    const cart = await Cart.findOne({ userId });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    const item = cart.items.find(
      (i) => i.productId.toString() === productId
    );
    if (!item) return res.status(404).json({ message: "Item not found in cart" });

    item.quantity = quantity;
    await cart.save();

    const updatedCart = await cart.populate("items.productId");
    res.json(updatedCart);
  } catch (err) {
    res.status(500).json({ message: "Error updating cart", error: err });
  }
};

/**
 * Xóa sản phẩm khỏi giỏ hàng
 */
export const removeCartItem = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const { productId } = req.params;

    const cart = await Cart.findOne({ userId });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    cart.items.pull({ productId });
    await cart.save();

    const updatedCart = await cart.populate("items.productId");
    res.json(updatedCart);
  } catch (err) {
    res.status(500).json({ message: "Error removing item", error: err });
  }
};
export const clearCart = async (req: Request, res: Response) => {
    try {
      const userId = (req as any).user.id;
  
      const cart = await Cart.findOne({ userId });
      if (!cart) return res.status(404).json({ message: "Cart not found" });
  
      cart.items = [] as any;
      await cart.save();
  
      res.json({ message: "Cart cleared successfully" });
    } catch (err) {
      res.status(500).json({ message: "Error clearing cart", error: err });
    }
  };
