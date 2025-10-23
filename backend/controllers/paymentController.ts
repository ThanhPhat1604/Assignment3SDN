import { Request, Response } from "express";
import Order from "../models/Order";
// import * as PayOSModule from "@payos/node";


// const { PayOS } = PayOSModule as any;

// const payos = new PayOS({
//   clientId: process.env.PAYOS_CLIENT_ID!,
//   apiKey: process.env.PAYOS_API_KEY!,
//   checksumKey: process.env.PAYOS_CHECKSUM_KEY!,
// });
/**
 * 💸 Giả lập thanh toán thành công
 * - Cập nhật trạng thái đơn hàng thành "paid"
 * - Trả về order đã cập nhật
 */
export const simulatePayment = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const { orderId } = req.body;

    // Tìm đơn hàng của user
    const order = await Order.findOne({ _id: orderId, userId });
    if (!order) return res.status(404).json({ message: "Order not found" });

    // Nếu đã thanh toán rồi
    if (order.status === "paid") {
      return res.status(400).json({ message: "Order already paid" });
    }

    // Cập nhật trạng thái đơn hàng
    order.status = "paid";
    await order.save();

    res.json({
      message: "Payment simulated successfully",
      order,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error simulating payment", error: err });
  }
};

// export const createPayOSCheckout = async (req: Request, res: Response) => {
//   try {
//     const userId = (req as any).user.id;
//     const { orderId } = req.body;

//     const order = await Order.findOne({ _id: orderId, userId });
//     if (!order) return res.status(404).json({ message: "Order not found" });
//     if (order.status === "paid")
//       return res.status(400).json({ message: "Order already paid" });

//     const paymentData = {
//       amount: order.totalAmount,
//       description: `Thanh toán đơn hàng #${order._id}`,
//       orderCode: Number(order._id.toString().slice(-6)),
//       cancelUrl: `${process.env.FRONTEND_URL}/checkout`,
//       returnUrl: `${process.env.FRONTEND_URL}/success`,
//     };

//     // ✅ Bản 2.x dùng createPaymentLink
//     const paymentLink = await payos.paymentLink.create(paymentData);

//     res.json({ url: paymentLink.checkoutUrl });
//   } catch (err) {
//     console.error("❌ PayOS error:", err);
//     res
//       .status(500)
//       .json({ message: "Error creating PayOS payment link", error: err });
//   }
// };

// /**
//  * 🔔 Webhook callback
//  */
// export const payOSWebhook = async (req: Request, res: Response) => {
//   try {
//     const { data } = req.body;
//     console.log("🔔 PayOS webhook:", data);

//     const order = await Order.findOne({ _id: data.orderCode });
//     if (!order) return res.status(404).json({ message: "Order not found" });

//     order.status = "paid";
//     await order.save();

//     res.json({ success: true });
//   } catch (err) {
//     console.error("❌ Webhook error:", err);
//     res.status(500).json({ message: "Error processing webhook", error: err });
//   }
// };