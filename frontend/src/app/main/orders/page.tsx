"use client";
import React, { useEffect, useState } from "react";
import { createApiClient } from "@/lib/api";
import { Order } from "@/types/order";
import { 
  Package, 
  Clock, 
  CheckCircle, 
  Truck, 
  MapPin, 
  Calendar,
  CreditCard,
  ShoppingBag,
  Sparkles,
  Eye,
  ArrowRight,
  Filter,
  Search
} from "lucide-react";
import LoadingSpinner from "@/components/LoadingSpinner";

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const api = await createApiClient();
        const res = await api.get("/orders");
        const orderList: Order[] = res.data as Order[];
        console.log("✅ Orders API Response:", res.data);
        console.log("📦 Sample order products:", res.data[0]?.products);
        setOrders(orderList);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const getStatusInfo = (status: string) => {
    switch (status.toLowerCase()) {
      case "paid":
        return {
          icon: CheckCircle,
          label: "Đã thanh toán",
          color: "bg-green-100 text-green-700 border-green-200",
          iconColor: "text-green-600"
        };
      case "pending":
        return {
          icon: Clock,
          label: "Chờ xử lý",
          color: "bg-yellow-100 text-yellow-700 border-yellow-200",
          iconColor: "text-yellow-600"
        };
      case "shipped":
        return {
          icon: Truck,
          label: "Đang giao hàng",
          color: "bg-blue-100 text-blue-700 border-blue-200",
          iconColor: "text-blue-600"
        };
      case "delivered":
        return {
          icon: Package,
          label: "Đã giao hàng",
          color: "bg-purple-100 text-purple-700 border-purple-200",
          iconColor: "text-purple-600"
        };
      default:
        return {
          icon: Clock,
          label: status,
          color: "bg-gray-100 text-gray-700 border-gray-200",
          iconColor: "text-gray-600"
        };
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesStatus = filterStatus === "all" || order.status.toLowerCase() === filterStatus;
    const matchesSearch = searchTerm === "" || 
      order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.products.some(p => p.productId.name.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesStatus && matchesSearch;
  });

  if (loading) {
    return (
      <LoadingSpinner 
        size="xl" 
        message="Đang tải đơn hàng..." 
        variant="fullscreen"
        className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50"
      />
    );
  }

  if (orders.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-6">
        <div className="text-center max-w-md mx-auto">
          <div className="relative mb-8">
            <div className="w-32 h-32 mx-auto bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center shadow-2xl">
              <Package className="w-16 h-16 text-gray-500 animate-pulse" />
            </div>
            <div className="absolute -top-2 -right-2">
              <Sparkles className="w-8 h-8 text-yellow-400 animate-bounce" />
            </div>
          </div>
          
          <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-600 to-gray-800 bg-clip-text text-transparent mb-4">
            Chưa có đơn hàng
          </h2>
          <p className="text-gray-600 mb-8 text-lg">
            Bạn chưa có đơn hàng nào. Hãy bắt đầu mua sắm ngay!
          </p>
          
          <button
            onClick={() => window.location.href = "/main/products"}
            className="group relative inline-flex items-center gap-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-2xl font-semibold text-lg shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 hover:from-blue-700 hover:to-purple-700"
          >
            <ShoppingBag className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
            Bắt đầu mua sắm
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
            <Package className="w-8 h-8 text-blue-600" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Lịch sử đơn hàng
            </h1>
          </div>
          <p className="text-gray-600 text-lg">
            Theo dõi và quản lý đơn hàng của bạn
          </p>
        </div>

        {/* Filters and Search */}
        <div className="mb-8">
          <div className="bg-white rounded-3xl shadow-xl p-6">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Tìm kiếm đơn hàng..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
              </div>

              {/* Status Filter */}
              <div className="flex items-center gap-3">
                <Filter className="w-5 h-5 text-gray-600" />
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white"
                >
                  <option value="all">Tất cả trạng thái</option>
                  <option value="pending">Chờ xử lý</option>
                  <option value="paid">Đã thanh toán</option>
                  <option value="shipped">Đang giao hàng</option>
                  <option value="delivered">Đã giao hàng</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Orders List */}
        <div className="space-y-6">
          {filteredOrders.map((order, index) => {
            const statusInfo = getStatusInfo(order.status);
            const StatusIcon = statusInfo.icon;
            
            return (
              <div
                key={order._id}
                className="group bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden transform hover:-translate-y-2"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Gradient border effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-3xl opacity-0 group-hover:opacity-10 transition-opacity duration-500"></div>
                
                <div className="relative p-8">
                  {/* Order Header */}
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl flex items-center justify-center shadow-lg">
                        <Package className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-800">
                          Đơn hàng #{order._id.slice(-8).toUpperCase()}
                        </h3>
                        <p className="text-sm text-gray-600 flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          {new Date().toLocaleDateString('vi-VN')}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <div className={`flex items-center gap-2 px-4 py-2 rounded-xl border-2 ${statusInfo.color}`}>
                        <StatusIcon className={`w-5 h-5 ${statusInfo.iconColor}`} />
                        <span className="font-semibold">{statusInfo.label}</span>
                      </div>
                      
                      <button className="group/btn flex items-center gap-2 text-blue-600 hover:text-blue-800 px-4 py-2 rounded-xl hover:bg-blue-50 transition-all duration-200 hover:scale-105">
                        <Eye className="w-4 h-4 group-hover/btn:scale-110 transition-transform duration-200" />
                        <span className="font-medium">Chi tiết</span>
                      </button>
                    </div>
                  </div>

                  {/* Products */}
                  <div className="mb-6">
                    <h4 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                      <ShoppingBag className="w-5 h-5 text-blue-600" />
                      Sản phẩm ({order.products.length})
                    </h4>
                    <div className="grid gap-3">
                      {order.products.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors duration-200">
                          <div className="w-12 h-12 bg-gradient-to-br from-gray-200 to-gray-300 rounded-xl flex items-center justify-center">
                            <Package className="w-6 h-6 text-gray-600" />
                          </div>
                          <div className="flex-1">
                            <h5 className="font-medium text-gray-800">{item.productId.name}</h5>
                            <p className="text-sm text-gray-600">Số lượng: {item.quantity}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-green-600">
                              ${(item.productId.price * item.quantity).toFixed(2)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Order Footer */}
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pt-6 border-t border-gray-200">
                    <div className="flex items-center gap-6 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        <span>Giao hàng tận nơi</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CreditCard className="w-4 h-4" />
                        <span>Thanh toán online</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-sm text-gray-600">Tổng cộng</p>
                        <p className="text-2xl font-bold bg-gradient-to-r from-green-500 to-blue-500 bg-clip-text text-transparent">
                          ${order.totalAmount.toFixed(2)}
                        </p>
                      </div>
                      
                      <button className="group/btn flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
                        <span>Theo dõi đơn hàng</span>
                        <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform duration-300" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty Filter Results */}
        {filteredOrders.length === 0 && orders.length > 0 && (
          <div className="text-center py-12">
            <div className="w-24 h-24 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Search className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">Không tìm thấy đơn hàng</h3>
            <p className="text-gray-500">Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm</p>
          </div>
        )}
      </div>
    </div>
  );
}
