"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import toast from "react-hot-toast";
import * as cartApi from "@/lib/api"; // ✅ import toàn bộ API với namespace
console.log("🧩 cartApi keys:", Object.keys(cartApi));
import { CartResponse, CartItem } from "@/types/cart";


interface CartContextType {
  items: CartItem[];
  total: number;
  addItem: (product: CartItem | string, quantity?: number) => Promise<void>;
  updateItem: (productId: string, quantity: number) => Promise<void>;
  removeItem: (productId: string) => Promise<void>;
  clear: () => Promise<void>;
  reload: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);

  const total = items.reduce((sum, item) => sum + item.productId.price * item.quantity, 0);

  // 🧩 Load cart từ backend khi app mở
  const reload = async () => {
    try {
      const data = await cartApi.getCart();
  
      // ✅ Nếu là object có field items
      if (data && "items" in data && Array.isArray(data.items)) {
        setItems(data.items);
      } else {
        console.warn("⚠️ Cart data không hợp lệ:", data);
        setItems([]); // tránh lỗi render
      }
    } catch (err: any) {
      console.error("❌ Lỗi load giỏ hàng:", err.message);
    }
  };
  

  useEffect(() => {
    reload();
  }, []);

  // ➕ Thêm sản phẩm vào giỏ
  const addItem = async (product: CartItem | string, quantity: number = 1) => {
    try {
      const productId = typeof product === "string" ? product : product.productId._id;

      // ✅ Gọi API thêm sản phẩm
      await cartApi.addToCart(productId, quantity);

      // ✅ Reload lại cart từ server để đảm bảo dữ liệu mới nhất
      await reload();

      toast.success("✅ Đã thêm sản phẩm vào giỏ hàng!");
    } catch (err: any) {
      console.error("❌ Add to cart error:", err);
      toast.error(`Lỗi khi thêm sản phẩm: ${err.message || "Không xác định"}`);
    }
  };

  // ✏️ Cập nhật số lượng
  const updateItem = async (productId: string, quantity: number) => {
    try {
      await cartApi.updateCartItem(productId, quantity);
      await reload();
      toast.success("🛒 Đã cập nhật số lượng!");
    } catch (err: any) {
      toast.error(`Lỗi cập nhật sản phẩm: ${err.message}`);
    }
  };

  // ❌ Xóa sản phẩm
  const removeItem = async (productId: string) => {
    try {
      await cartApi.removeCartItem(productId);
      await reload();
      toast.success("🗑️ Đã xóa sản phẩm khỏi giỏ hàng!");
    } catch (err: any) {
      toast.error(`Lỗi khi xóa sản phẩm: ${err.message}`);
    }
  };

  // 🧹 Xóa toàn bộ giỏ
  const clear = async () => {
    try {
      await cartApi.clearCart();
      setItems([]);
      toast.success("🧺 Đã xóa toàn bộ giỏ hàng!");
    } catch (err: any) {
      toast.error(`Lỗi khi xóa giỏ hàng: ${err.message}`);
    }
  };

  return (
    <CartContext.Provider
      value={{ items, total, addItem, updateItem, removeItem, clear, reload }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart phải được dùng bên trong CartProvider");
  return context;
};
