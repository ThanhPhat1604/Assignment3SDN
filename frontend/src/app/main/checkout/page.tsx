"use client";
import React, { useState } from "react";
import { useCart } from "@/contexts/CartContext";
import { createApiClient } from "@/lib/api";
import { useRouter } from "next/navigation";
import { 
  CreditCard, 
  MapPin, 
  User, 
  Phone, 
  Mail, 
  CheckCircle, 
  ArrowRight, 
  ShoppingBag,
  Sparkles,
  Lock,
  Clock,
  Truck
} from "lucide-react";
import SuccessMessage from "@/components/SuccessMessage";
import ErrorMessage from "@/components/ErrorMessage";

export default function CheckoutPage() {
  const { items, total, clear } = useCart();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Form data
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    zipCode: "",
    paymentMethod: "card"
  });

  const steps = [
    { id: 1, title: "Thông tin", icon: User },
    { id: 2, title: "Thanh toán", icon: CreditCard },
    { id: 3, title: "Xác nhận", icon: CheckCircle }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handlePlaceOrder = async () => {
    if (items.length === 0) return;
    setLoading(true);
    
    try {
      const orderData = {
        products: items.map((i) => ({
          productId: i.productId._id,
          quantity: i.quantity,
        })),
        totalAmount: total,
        customerInfo: formData
      };

      const api = await createApiClient();
      await api.post("/orders", orderData);
      clear();
      setOrderSuccess(true);
      setError(null);
      
      // Show success animation
      setTimeout(() => {
        router.push("/main/orders");
      }, 3000);
      
    } catch (error: any) {
      console.error(error);
      setError(error.message || "Có lỗi xảy ra khi đặt hàng");
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => {
    if (currentStep < 3) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  if (items.length === 0 && !orderSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-6">
        <div className="text-center max-w-md mx-auto">
          <div className="relative mb-8">
            <div className="w-32 h-32 mx-auto bg-gradient-to-br from-orange-100 to-red-100 rounded-full flex items-center justify-center shadow-2xl">
              <ShoppingBag className="w-16 h-16 text-orange-500 animate-pulse" />
            </div>
          </div>
          
          <h2 className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent mb-4">
            Giỏ hàng trống
          </h2>
          <p className="text-gray-600 mb-8 text-lg">
            Bạn cần có sản phẩm trong giỏ hàng để thanh toán
          </p>
          
        <button
          onClick={() => router.push("/main/products")}
            className="group relative inline-flex items-center gap-3 bg-gradient-to-r from-orange-600 to-red-600 text-white px-8 py-4 rounded-2xl font-semibold text-lg shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
        >
            <ShoppingBag className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
          Quay lại mua sắm
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
        </button>
        </div>
      </div>
    );
  }

  if (orderSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 flex items-center justify-center p-6">
        <div className="text-center max-w-lg mx-auto">
          <div className="relative mb-8">
            <div className="w-40 h-40 mx-auto bg-gradient-to-br from-green-100 to-emerald-100 rounded-full flex items-center justify-center shadow-2xl animate-pulse">
              <CheckCircle className="w-20 h-20 text-green-500" />
            </div>
            <div className="absolute -top-4 -right-4">
              <Sparkles className="w-12 h-12 text-yellow-400 animate-bounce" />
            </div>
            <div className="absolute -bottom-4 -left-4">
              <Sparkles className="w-8 h-8 text-pink-400 animate-bounce" style={{ animationDelay: '0.5s' }} />
            </div>
          </div>
          
          <h2 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-4">
            Đặt hàng thành công!
          </h2>
          <p className="text-gray-600 mb-8 text-lg">
            Cảm ơn bạn đã mua sắm! Đơn hàng của bạn đang được xử lý.
          </p>
          
          <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
            <div className="flex items-center justify-center gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-blue-500" />
                <span>Đang xử lý</span>
              </div>
              <ArrowRight className="w-4 h-4" />
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-orange-500" />
                <span>Đang giao hàng</span>
              </div>
            </div>
          </div>
          
          <p className="text-sm text-gray-500">
            Chuyển hướng đến trang đơn hàng trong 3 giây...
          </p>
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
            <CreditCard className="w-8 h-8 text-blue-600" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Thanh toán
            </h1>
          </div>
          <p className="text-gray-600 text-lg">
            Hoàn tất đơn hàng của bạn một cách an toàn
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-8">
            <ErrorMessage 
              error={error} 
              onDismiss={() => setError(null)}
              className="rounded-2xl shadow-lg"
            />
          </div>
        )}

        {/* Progress Steps */}
        <div className="mb-12">
          <div className="flex justify-center">
            <div className="flex items-center space-x-8">
              {steps.map((step, index) => {
                const Icon = step.icon;
                const isActive = currentStep >= step.id;
                const isCompleted = currentStep > step.id;
                
                return (
                  <div key={step.id} className="flex items-center">
                    <div className={`flex items-center justify-center w-12 h-12 rounded-full transition-all duration-300 ${
                      isCompleted 
                        ? 'bg-green-500 text-white shadow-lg' 
                        : isActive 
                        ? 'bg-blue-500 text-white shadow-lg scale-110' 
                        : 'bg-gray-200 text-gray-500'
                    }`}>
                      {isCompleted ? (
                        <CheckCircle className="w-6 h-6" />
                      ) : (
                        <Icon className="w-6 h-6" />
                      )}
                    </div>
                    <span className={`ml-3 font-medium ${
                      isActive ? 'text-blue-600' : 'text-gray-500'
                    }`}>
                      {step.title}
                    </span>
                    {index < steps.length - 1 && (
                      <ArrowRight className="w-5 h-5 text-gray-300 mx-4" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-3xl shadow-2xl p-8">
              {currentStep === 1 && (
                <div className="space-y-6">
                  <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                    <User className="w-6 h-6 text-blue-600" />
                    Thông tin giao hàng
                  </h3>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Họ và tên *
                      </label>
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        placeholder="Nhập họ và tên"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        placeholder="Nhập email"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Số điện thoại *
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        placeholder="Nhập số điện thoại"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Mã bưu điện
                      </label>
                      <input
                        type="text"
                        name="zipCode"
                        value={formData.zipCode}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        placeholder="Nhập mã bưu điện"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Địa chỉ *
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      placeholder="Nhập địa chỉ giao hàng"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Thành phố *
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      placeholder="Nhập thành phố"
                      required
                    />
                  </div>
                </div>
              )}

              {currentStep === 2 && (
  <div className="space-y-6">
    <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
      <CreditCard className="w-6 h-6 text-blue-600" />
      Phương thức thanh toán
    </h3>

    {/* chọn phương thức thanh toán */}
    <div className="space-y-4">
      {/* Thẻ tín dụng/ghi nợ */}
      <button
        type="button"
        onClick={() =>
          setFormData((prev) => ({ ...prev, paymentMethod: "card" }))
        }
        className={`w-full border-2 rounded-2xl p-6 transition-all duration-300 flex items-center gap-4 ${
          formData.paymentMethod === "card"
            ? "border-blue-500 bg-blue-50 shadow-lg"
            : "border-gray-200 hover:border-blue-300"
        }`}
      >
        <CreditCard
          className={`w-8 h-8 ${
            formData.paymentMethod === "card" ? "text-blue-600" : "text-gray-600"
          }`}
        />
        <div className="text-left flex-1">
          <h4 className="font-semibold text-gray-800">
            Thẻ tín dụng / ghi nợ
          </h4>
          <p className="text-sm text-gray-600">
            Thanh toán an toàn với thẻ Visa, Mastercard
          </p>
        </div>
        {formData.paymentMethod === "card" && (
          <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
            <div className="w-2.5 h-2.5 bg-white rounded-full" />
          </div>
        )}
      </button>

      {/* Thanh toán khi nhận hàng */}
      <button
        type="button"
        onClick={() =>
          setFormData((prev) => ({ ...prev, paymentMethod: "cod" }))
        }
        className={`w-full border-2 rounded-2xl p-6 transition-all duration-300 flex items-center gap-4 ${
          formData.paymentMethod === "cod"
            ? "border-green-500 bg-green-50 shadow-lg"
            : "border-gray-200 hover:border-green-300"
        }`}
      >
        <Lock
          className={`w-8 h-8 ${
            formData.paymentMethod === "cod" ? "text-green-600" : "text-gray-600"
          }`}
        />
        <div className="text-left flex-1">
          <h4 className="font-semibold text-gray-800">
            Thanh toán khi nhận hàng
          </h4>
          <p className="text-sm text-gray-600">
            Thanh toán bằng tiền mặt khi nhận hàng
          </p>
        </div>
        {formData.paymentMethod === "cod" && (
          <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center">
            <div className="w-2.5 h-2.5 bg-white rounded-full" />
          </div>
        )}
      </button>
      <button
    type="button"
    onClick={() =>
      setFormData((prev) => ({ ...prev, paymentMethod: "payos" }))
    }
    className={`w-full border-2 rounded-2xl p-6 transition-all duration-300 flex items-center gap-4 ${
      formData.paymentMethod === "payos"
        ? "border-cyan-500 bg-cyan-50 shadow-lg"
        : "border-gray-200 hover:border-cyan-300"
    }`}
  >
    <img
      src="https://storage.googleapis.com/payos-public-assets/logo.png"
      alt="PayOS Logo"
      className="w-8 h-8"
    />
    <div className="text-left flex-1">
      <h4 className="font-semibold text-gray-800">Thanh toán qua PayOS</h4>
      <p className="text-sm text-gray-600">
        Thanh toán trực tuyến an toàn và nhanh chóng với PayOS
      </p>
    </div>
    {formData.paymentMethod === "payos" && (
      <div className="w-6 h-6 bg-cyan-600 rounded-full flex items-center justify-center">
        <div className="w-2.5 h-2.5 bg-white rounded-full" />
      </div>
    )}
  </button>
    </div>
    

    {/* Thông tin bảo mật */}
    <div className="bg-green-50 border border-green-200 rounded-2xl p-6 mt-6">
      <div className="flex items-center gap-3">
        <Lock className="w-6 h-6 text-green-600" />
        <div>
          <h4 className="font-semibold text-green-800">Bảo mật thanh toán</h4>
          <p className="text-sm text-green-700">
            Thông tin thanh toán của bạn được mã hóa và bảo vệ an toàn
          </p>
        </div>
      </div>
    </div>
  </div>
)}


              {currentStep === 3 && (
                <div className="space-y-6">
                  <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                    Xác nhận đơn hàng
                  </h3>
                  
                  <div className="bg-gray-50 rounded-2xl p-6">
                    <h4 className="font-semibold text-gray-800 mb-4">Thông tin giao hàng:</h4>
                    <div className="space-y-2 text-sm text-gray-600">
                      <p><strong>Tên:</strong> {formData.fullName}</p>
                      <p><strong>Email:</strong> {formData.email}</p>
                      <p><strong>Điện thoại:</strong> {formData.phone}</p>
                      <p><strong>Địa chỉ:</strong> {formData.address}</p>
                      <p><strong>Thành phố:</strong> {formData.city}</p>
                    </div>
                  </div>
                  
                  <div className="bg-blue-50 rounded-2xl p-6">
                    <h4 className="font-semibold text-gray-800 mb-4">Phương thức thanh toán:</h4>
                    <div className="flex items-center gap-3">
                      <CreditCard className="w-6 h-6 text-blue-600" />
                      <span className="text-gray-700">Thẻ tín dụng/ghi nợ</span>
                    </div>
                  </div>
      </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between mt-8">
                {currentStep > 1 && (
                  <button
                    onClick={prevStep}
                    className="px-6 py-3 text-gray-600 hover:text-gray-800 font-medium hover:bg-gray-100 rounded-xl transition-all duration-200"
                  >
                    Quay lại
                  </button>
                )}
                
                <div className="ml-auto">
                  {currentStep < 3 ? (
                    <button
                      onClick={nextStep}
                      className="group px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center gap-3"
                    >
                      Tiếp tục
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                    </button>
                  ) : (
        <button
          disabled={loading}
          onClick={handlePlaceOrder}
                      className="group px-8 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                    >
                      {loading ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Đang xử lý...
                        </>
                      ) : (
                        <>
                          <Lock className="w-5 h-5" />
                          Xác nhận đặt hàng
                        </>
                      )}
        </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-6">
              <div className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-100">
                <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                  Đơn hàng của bạn
                </h3>
                
                <div className="space-y-4 mb-6">
                  {items.map((item) => (
                    <div key={item.productId._id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl">
                      {item.productId.image && (
                        <img
                          src={item.productId.image}
                          alt={item.productId.name}
                          className="w-12 h-12 object-cover rounded-lg"
                        />
                      )}
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-800 text-sm">{item.productId.name}</h4>
                        <p className="text-xs text-gray-600">Số lượng: {item.quantity}</p>
                      </div>
                      <span className="font-semibold text-green-600">
                        ${(item.productId.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
                
                <div className="border-t pt-4 space-y-3">
                  <div className="flex justify-between text-gray-600">
                    <span>Tạm tính:</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Phí vận chuyển:</span>
                    <span className="text-green-600 font-semibold">Miễn phí</span>
                  </div>
                  <div className="border-t pt-3">
                    <div className="flex justify-between text-xl font-bold">
                      <span>Tổng cộng:</span>
                      <span className="bg-gradient-to-r from-green-500 to-blue-500 bg-clip-text text-transparent">
                        ${total.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
