// ✅ CẢI THIỆN api.ts
import axios, { AxiosError } from "axios";
import { getSession, signOut } from "next-auth/react";
import type { IProduct } from "@/types/product";
import type { CartResponse as ICartResponse } from "@/types/cart";



const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

// 🧩 Tạo axios instance có sẵn token + interceptor
export const createApiClient = async () => {
  const session = await getSession();
  const token =
    (session as any)?.accessToken || (session as any)?.user?.accessToken;

  const instance = axios.create({
    baseURL: `${API_BASE_URL}/api`,
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });

  // ✅ Interceptor xử lý lỗi toàn cục
  instance.interceptors.response.use(
    (response) => {
      // Validate response data
      if (response.data === undefined || response.data === null) {
        console.warn("⚠️ Empty response data received");
        return response;
      }
      return response;
    },
    (error: AxiosError<{ message: string }>) => {
      let message = "An error occurred";
      
      try {
        if (error.response?.data) {
          if (typeof error.response.data === 'string') {
            message = error.response.data;
          } else if (error.response.data.message) {
            message = error.response.data.message;
          }
        }
      } catch (parseError) {
        console.error("❌ Error parsing response:", parseError);
        message = `Server error: ${error.response?.status || 'Unknown'}`;
      }

      // ⚠️ Nếu token hết hạn, có thể tự logout
      if (error.response?.status === 401) {
        console.error("❌ Authentication failed:", message);
        // signOut({ callbackUrl: "/auth/login" }); // ← bật nếu muốn tự logout
      }

      throw new Error(message);
    }
  );

  return instance;
};

// ✅ Lấy danh sách sản phẩm
// ✅ Lấy danh sách sản phẩm (luôn lấy toàn bộ, không giới hạn)
export const getProducts = async (forceRefresh: boolean = false): Promise<IProduct[]> => {
  const api = await createApiClient();
  try {
    // ⚙️ Thêm ?limit=0 để backend trả về toàn bộ sản phẩm
    let url = '/products?limit=0';
    
    if (forceRefresh) {
      // Force refresh - add timestamp and random to bypass cache
      const timestamp = Date.now();
      const random = Math.random().toString(36).substring(7);
      url = `/products?limit=0&ts=${timestamp}&r=${random}`;
    }

    const res = await api.get(url, {
      headers: forceRefresh ? {
        "Cache-Control": "no-cache, no-store, must-revalidate",
        "Pragma": "no-cache",
        "Expires": "0",
        "If-Modified-Since": "0"
      } : {
        "Cache-Control": "max-age=30" // Cache for 30 seconds
      },
    });

    console.log("📦 API Response:", res.data);

    // Backend returns { success: true, products: [...] }
    if (res.data?.success && Array.isArray(res.data.products)) {
      return res.data.products;
    }

    // Fallback for different response formats
    if (Array.isArray(res.data)) return res.data;
    if (Array.isArray(res.data.data)) return res.data.data;

    console.warn("⚠️ Unexpected products response format:", res.data);
    return [];
  } catch (error: any) {
    console.error("❌ Lỗi khi lấy danh sách sản phẩm:", error.message);
    return [];
  }
};


// ✅ Lấy chi tiết sản phẩm theo ID
export const getProductById = async (id: string): Promise<IProduct | null> => {
  const api = await createApiClient();
  try {
    const res = await api.get(`/products/${id}`);

    if (res.data?._id) return res.data;
    if (res.data?.data?._id) return res.data.data;
    if (res.data?.product?._id) return res.data.product;

    console.warn("⚠️ API /products/:id không trả về sản phẩm hợp lệ:", res.data);
    return null;
  } catch (error: any) {
    console.error("❌ Lỗi khi lấy chi tiết sản phẩm:", error.message);
    return null;
  }
};

// ✅ Xóa sản phẩm theo ID
export const deleteProduct = async (id: string): Promise<boolean> => {
  const api = await createApiClient();
  try {
    const res = await api.delete(`/products/${id}`);

    if (res.status === 200 || res.status === 204) {
      console.log("✅ Đã xóa sản phẩm:", id);
      return true;
    }

    console.warn("⚠️ API không trả về mã thành công:", res.status);
    return false;
  } catch (error: any) {
    console.error("❌ Lỗi khi xóa sản phẩm:", error.message);
    return false;
  }
};

// ✅ Tạo sản phẩm mới
export const createProduct = async (product: any) => {
  const api = await createApiClient();
  try {
    const res = await api.post("/products", product);
    
    console.log("📦 Create Product Response:", res.data);
    
    // Return the product data in a consistent format
    if (res.data?.product) {
      return { product: res.data.product, success: true };
    } else if (res.data?._id) {
      return { product: res.data, success: true };
    } else {
      throw new Error("Invalid response format from server");
    }
  } catch (error: any) {
    console.error("❌ Lỗi khi tạo sản phẩm:", error.message);
    throw error;
  }
};

// ✅ Logout người dùng với NextAuth
export const logoutUser = async () => {
  await signOut({ callbackUrl: "/auth/login" });
};

// ✅ Request password reset
export const requestPasswordReset = async (email: string) => {
  const api = await createApiClient();
  try {
    const res = await api.post("/auth/forgot-password", { email });
    return res.data;
  } catch (error: any) {
    console.error("❌ Lỗi khi yêu cầu reset password:", error.message);
    throw error;
  }
};

// ✅ Resend verification email
export const resendVerificationEmail = async (email: string) => {
  const api = await createApiClient();
  try {
    const res = await api.post("/auth/resend-verification", { email });
    return res.data;
  } catch (error: any) {
    console.error("❌ Lỗi khi gửi lại email xác thực:", error.message);
    throw error;
  }
};

// ✅ Reset password
export const resetPassword = async (token: string, newPassword: string) => {
  const api = await createApiClient();
  try {
    const res = await api.post("/auth/reset-password", { token, newPassword });
    return res.data;
  } catch (error: any) {
    console.error("❌ Lỗi khi reset password:", error.message);
    throw error;
  }
};

// ✅ Register user
export const registerUser = async (userData: any) => {
  const api = await createApiClient();
  try {
    const res = await api.post("/auth/register", userData);
    return res.data;
  } catch (error: any) {
    console.error("❌ Lỗi khi đăng ký:", error.message);
    throw error;
  }
};

// ✅ Update product
export const updateProduct = async (id: string, productData: any) => {
  const api = await createApiClient();
  try {
    const res = await api.put(`/products/${id}`, productData);
    
    console.log("📦 Update Product Response:", res.data);
    
    // Return the product data in a consistent format
    if (res.data?.product) {
      return { product: res.data.product, success: true };
    } else if (res.data?._id) {
      return { product: res.data, success: true };
    } else {
      throw new Error("Invalid response format from server");
    }
  } catch (error: any) {
    console.error("❌ Lỗi khi cập nhật sản phẩm:", error.message);
    throw error;
  }
};

// ✅ Force refresh products (clear any potential cache)
export const forceRefreshProducts = async (): Promise<IProduct[]> => {
  console.log("🔄 Force refreshing products...");
  return await getProducts();
};

// ======================= CART API =======================

interface CartResponse {
  items?: any[];
  cart?: { items?: any[]; total?: number };
  data?: { items?: any[] };
  total?: number;
}

// ✅ Chuẩn hóa dữ liệu cart trả về
const extractCartItems = (res: any): any[] => {
  if (!res || !res.data) return [];
  const data = res.data as CartResponse;
  if (Array.isArray(data.items)) return data.items;
  if (Array.isArray(data.cart?.items)) return data.cart.items;
  if (Array.isArray(data.data?.items)) return data.data.items;
  return [];
};

// ✅ Lấy giỏ hàng hiện tại
// ✅ Lấy giỏ hàng hiện tại
export const getCart = async (): Promise<CartResponse> => {
  const api = await createApiClient();
  try {
    const res = await api.get("/cart"); // <-- tự động thêm baseURL: http://localhost:5000/api
    return res.data;
  } catch (error: any) {
    console.error("❌ Lỗi load giỏ hàng:", error.message);
    throw error;
  }
};


// ✅ Thêm sản phẩm vào giỏ
export const addToCart = async (productId: string, quantity: number = 1) => {
  const api = await createApiClient();
  try {
    const res = await api.post("/cart", { productId, quantity });
    const items = extractCartItems(res);
    return items;
  } catch (error: any) {
    console.error("❌ Lỗi khi thêm sản phẩm vào giỏ:", error.message);
    throw error;
  }
};

// ✅ Cập nhật số lượng sản phẩm trong giỏ
export const updateCartItem = async (productId: string, quantity: number) => {
  const api = await createApiClient();
  try {
    const res = await api.put(`/cart/${productId}`, { quantity });
    const items = extractCartItems(res);
    return items;
  } catch (error: any) {
    console.error("❌ Lỗi khi cập nhật giỏ hàng:", error.message);
    throw error;
  }
};

// ✅ Xóa sản phẩm khỏi giỏ
export const removeCartItem = async (productId: string) => {
  const api = await createApiClient();
  try {
    const res = await api.delete(`/cart/${productId}`);
    return (res.data);
  } catch (error: any) {
    console.error("❌ Lỗi khi xóa sản phẩm khỏi giỏ:", error.message);
    throw error;
  }
};

// ✅ Xóa toàn bộ giỏ hàng
export const clearCart = async () => {
  const api = await createApiClient();
  try {
    const res = await api.delete("/cart");
    const items = extractCartItems(res);
    return items;
  } catch (error: any) {
    console.error("❌ Lỗi khi xóa toàn bộ giỏ hàng:", error.message);
    throw error;
  }
};


// =======================  ORDER API =======================

export const createOrder = async (orderData: any) => {
  const api = await createApiClient();
  try {
    const res = await api.post("/orders", orderData);
    return res.data;
  } catch (error: any) {
    console.error("❌ Lỗi khi tạo đơn hàng:", error.message);
    throw error;
  }
};

export const getMyOrders = async () => {
  const api = await createApiClient();
  try {
    const res = await api.get("/orders/me");
    return res.data;
  } catch (error: any) {
    console.error("❌ Lỗi khi lấy danh sách đơn hàng:", error.message);
    throw error;
  }
};

export const getOrderById = async (orderId: string) => {
  const api = await createApiClient();
  try {
    const res = await api.get(`/orders/${orderId}`);
    return res.data;
  } catch (error: any) {
    console.error("❌ Lỗi khi lấy chi tiết đơn hàng:", error.message);
    throw error;
  }
};

// =======================  PAYMENT API =======================

export const simulatePayment = async (
  orderId: string,
  method: string = "credit_card"
) => {
  const api = await createApiClient();
  try {
    const res = await api.post("/payments/simulate", { orderId, method });
    return res.data;
  } catch (error: any) {
    console.error("❌ Lỗi khi giả lập thanh toán:", error.message);
    throw error;
  }
};
