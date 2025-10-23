import express from "express";
import { protect } from "../middleware/authMiddleware";
import { simulatePayment } from "../controllers/paymentController";

const router = express.Router();

// 🧾 Thanh toán giả lập
router.post("/simulate", protect, simulatePayment);

export default router;
