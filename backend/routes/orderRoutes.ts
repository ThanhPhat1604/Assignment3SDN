import express from "express";
import Order from "../models/Order";
import { protect } from "../middleware/authMiddleware";

const router = express.Router();

router.post("/", protect, async (req, res) => {
  const { products, totalAmount } = req.body;
  const order = await Order.create({
    userId: (req as any).user.id,
    products,
    totalAmount,
  });
  res.status(201).json(order);
});

router.get("/", protect, async (req, res) => {
  const orders = await Order.find({ userId: (req as any).user.id }).sort({ createdAt: -1 });
  res.json(orders);
});

export default router;
