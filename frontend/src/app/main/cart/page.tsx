"use client";
import React, { useState } from "react";
import { useCart } from "@/contexts/CartContext";
import { useRouter } from "next/navigation";
import {
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import ConfirmationDialog from "@/components/ConfirmationDialog";

export default function CartPage() {
  const { items, removeItem, total, updateItem } = useCart();
  console.log("🛒 Dữ liệu giỏ hàng thực tế:", items);
  const router = useRouter();
  const [removingItems, setRemovingItems] = useState<Set<string>>(new Set());
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);

  const handleRemoveItem = async (productId: string) => {
    setItemToDelete(productId);
    setShowDeleteDialog(true);
  };

  const confirmRemoveItem = () => {
    if (itemToDelete) {
      setRemovingItems((prev) => new Set(prev).add(itemToDelete));

      // Hiệu ứng xóa mượt
      setTimeout(() => {
        removeItem(itemToDelete);
        setRemovingItems((prev) => {
          const newSet = new Set(prev);
          newSet.delete(itemToDelete);
          return newSet;
        });
      }, 300);
    }
    setShowDeleteDialog(false);
    setItemToDelete(null);
  };

  const cancelRemoveItem = () => {
    setShowDeleteDialog(false);
    setItemToDelete(null);
  };

  const updateQuantity = async (productId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      handleRemoveItem(productId);
      return;
    }

    try {
      await updateItem(productId, newQuantity);
    } catch (error) {
      console.error("❌ Lỗi khi cập nhật số lượng:", error);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-6">
        <div className="text-center max-w-md mx-auto">
          <div className="relative mb-8">
            <div className="w-32 h-32 mx-auto bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center shadow-2xl">
              <ShoppingCart className="w-16 h-16 text-blue-500 animate-pulse" />
            </div>
            <div className="absolute -top-2 -right-2">
              <Sparkles className="w-8 h-8 text-yellow-400 animate-bounce" />
            </div>
          </div>

          <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Giỏ hàng trống
          </h2>
          <p className="text-gray-600 mb-8 text-lg">
            Hãy khám phá những sản phẩm tuyệt vời và thêm vào giỏ hàng nhé!
          </p>

          <button
            onClick={() => router.push("/main")}
            className="group relative inline-flex items-center gap-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-2xl font-semibold text-lg shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 hover:from-blue-700 hover:to-purple-700"
          >
            <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
            Khám phá sản phẩm
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="max-w-6xl mx-auto p-6">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 mb-4">
            <ShoppingCart className="w-8 h-8 text-blue-600" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Giỏ hàng của bạn
            </h1>
          </div>
          <p className="text-gray-600 text-lg">
            {items.length} sản phẩm trong giỏ hàng
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-6">
            {items.map((item, index) => (
              <div
                key={item.productId._id}
                className={`group relative bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden transform hover:-translate-y-2 ${
                  removingItems.has(item.productId._id)
                    ? "animate-pulse opacity-50"
                    : ""
                }`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-3xl opacity-0 group-hover:opacity-20 transition-opacity duration-500"></div>

                <div className="relative p-6">
                  <div className="flex items-center gap-6">
                    {/* Product Image */}
                    <div className="relative">
                      {item.productId.image ? (
                        <div className="w-24 h-24 rounded-2xl overflow-hidden shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                          <img
                            src={item.productId.image}
                            alt={item.productId.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                        </div>
                      ) : (
                        <div className="w-24 h-24 bg-gradient-to-br from-gray-200 to-gray-300 rounded-2xl flex items-center justify-center">
                          <ShoppingCart className="w-8 h-8 text-gray-500" />
                        </div>
                      )}

                      {/* Quantity badge */}
                      <div className="absolute -top-2 -right-2 bg-gradient-to-r from-pink-500 to-red-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg">
                        {item.quantity}
                      </div>
                    </div>

                    {/* Product Info */}
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors duration-300">
                        {item.productId.name}
                      </h3>
                      <p className="text-gray-600 mb-4">
                        Giá:{" "}
                        <span className="font-semibold text-green-600">
                          ${item.productId.price.toFixed(2)}
                        </span>
                      </p>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() =>
                            updateQuantity(item.productId._id, item.quantity - 1)
                          }
                          className="w-8 h-8 bg-gray-100 hover:bg-red-100 text-gray-600 hover:text-red-600 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110"
                        >
                          <Minus className="w-4 h-4" />
                        </button>

                        <span className="text-lg font-semibold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent min-w-[2rem] text-center">
                          {item.quantity}
                        </span>

                        <button
                          onClick={() =>
                            updateQuantity(item.productId._id, item.quantity + 1)
                          }
                          className="w-8 h-8 bg-gray-100 hover:bg-green-100 text-gray-600 hover:text-green-600 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Price & Remove */}
                    <div className="text-right">
                      <p className="text-2xl font-bold text-green-600 mb-4">
                        ${(item.productId.price * item.quantity).toFixed(2)}
                      </p>

                      <button
                        onClick={() => handleRemoveItem(item.productId._id)}
                        className="group/btn flex items-center gap-2 text-red-500 hover:text-red-700 px-4 py-2 rounded-xl hover:bg-red-50 transition-all duration-200 hover:scale-105"
                      >
                        <Trash2 className="w-4 h-4 group-hover/btn:rotate-12 transition-transform duration-200" />
                        <span className="font-medium">Xóa</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-6">
              <div className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-100">
                <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                  Tổng kết đơn hàng
                </h3>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-gray-600">
                    <span>Số sản phẩm:</span>
                    <span className="font-semibold">{items.length}</span>
                  </div>

                  <div className="flex justify-between text-gray-600">
                    <span>Tổng số lượng:</span>
                    <span className="font-semibold">
                      {items.reduce((sum, item) => sum + item.quantity, 0)}
                    </span>
                  </div>

                  <div className="border-t pt-4">
                    <div className="flex justify-between text-xl font-bold">
                      <span>Tổng cộng:</span>
                      <span className="bg-gradient-to-r from-green-500 to-blue-500 bg-clip-text text-transparent">
                        ${total.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => router.push("/main/checkout")}
                  className="group w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white py-4 px-6 rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-3"
                >
                  <span>Thanh toán</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                </button>

                <button
                  onClick={() => router.push("/main/products")}
                  className="w-full mt-4 text-gray-600 hover:text-blue-600 py-3 px-6 rounded-xl font-medium hover:bg-blue-50 transition-all duration-200"
                >
                  Tiếp tục mua sắm
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={showDeleteDialog}
        onClose={cancelRemoveItem}
        onConfirm={confirmRemoveItem}
        title="Xóa sản phẩm"
        message="Bạn có chắc chắn muốn xóa sản phẩm này khỏi giỏ hàng?"
        confirmText="Xóa"
        cancelText="Hủy"
        variant="danger"
      />
    </div>
  );
}
