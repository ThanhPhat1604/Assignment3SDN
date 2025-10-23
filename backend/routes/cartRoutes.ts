import express from "express";
import { protect } from "../middleware/authMiddleware";
import {
  addToCart,
  getCart,
  updateCartItem,
  removeCartItem,
  clearCart,
} from "../controllers/cartController";

const router = express.Router();

router.get("/", protect, getCart);

router.post("/", protect, addToCart);

router.put("/:productId", protect, updateCartItem);

router.delete("/:productId", protect, removeCartItem);

router.delete("/", protect, clearCart);

export default router;
