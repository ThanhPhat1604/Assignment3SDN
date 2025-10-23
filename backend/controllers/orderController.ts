import { Request, Response } from "express";
import Order from "../models/Order";
import Cart from "../models/Cart";
import Product from "../models/Product";

/**
 * 🧾 Tạo đơn hàng mới từ giỏ hàng
 */
export const createOrder = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;

    // Lấy giỏ hàng của user
    const cart = await Cart.findOne({ userId }).populate("items.productId");
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    // Tính tổng tiền
    const totalAmount = cart.items.reduce((sum, item: any) => {
      const price = item.productId?.price || 0;
      return sum + price * item.quantity;
    }, 0);

    // Chuẩn bị danh sách sản phẩm
    const orderItems = cart.items.map((item: any) => ({
      productId: item.productId._id,
      name: item.productId.name,
      price: item.productId.price,
      quantity: item.quantity,
    }));

    // Tạo order mới
    const newOrder = new Order({
      userId,
      products: orderItems,
      totalAmount,
      status: "unpaid",
    });

    await newOrder.save();

    // Xóa giỏ hàng sau khi đặt hàng
    await Cart.findOneAndDelete({ userId });

    res.status(201).json({
      message: "Order created successfully",
      order: newOrder,
    });
  } catch (err) {
    res.status(500).json({ message: "Error creating order", error: err });
  }
};

/**
 * 📦 Lấy danh sách đơn hàng của user
 */
export const getUserOrders = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;

    const orders = await Order.find({ userId }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: "Error fetching orders", error: err });
  }
};

/**
 * 🔍 Lấy chi tiết 1 đơn hàng
 */
export const getOrderById = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const { orderId } = req.params;

    const order = await Order.findOne({ _id: orderId, userId });
    if (!order) return res.status(404).json({ message: "Order not found" });

    res.json(order);
  } catch (err) {
    res.status(500).json({ message: "Error fetching order", error: err });
  }
};

/**
 * 🧾 Lấy tất cả đơn hàng (admin)
 */
export const getAllOrders = async (req: Request, res: Response) => {
  try {
    const orders = await Order.find()
      .populate("userId", "email")
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: "Error fetching all orders", error: err });
  }
};

/**
 * ⚙️ Cập nhật trạng thái đơn hàng (admin)
 */
export const updateOrderStatus = async (req: Request, res: Response) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: "Order not found" });

    order.status = status;
    await order.save();

    res.json({ message: "Order status updated", order });
  } catch (err) {
    res.status(500).json({ message: "Error updating order", error: err });
  }
};
