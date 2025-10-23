import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import productRoutes from "./routes/productRoutes"; 
import authRoutes from "./routes/authRoutes";
import orderRoutes from "./routes/orderRoutes";
import cartRoutes from "./routes/cartRoutes";
import paymentRoutes from "./routes/paymentRoutes";


dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ Cấu hình CORS cho cả localhost và domain Vercel
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://assignment2-umber-ten.vercel.app", // domain frontend deploy trên Vercel
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

// Middleware parse JSON
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);

// Routes
app.use("/api/products", productRoutes);

// Routes
app.use("/api/orders", orderRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/payment", paymentRoutes);

// Test route
app.get("/", (req, res) => {
  res.send("✅ API is running successfully...");
});

// ✅ Middleware xử lý lỗi toàn cục (rất hữu ích khi deploy)
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error("❌ Global Error:", err);
  res.status(500).json({
    success: false,
    message: "Internal server error",
    error: process.env.NODE_ENV === "development" ? err.message : undefined,
  });
});

// ✅ Kết nối MongoDB và khởi chạy server
mongoose
  .connect(process.env.MONGO_URI || "")
  .then(() => {
    console.log("✅ MongoDB connected");
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch((err) => console.error("❌ DB Connection Error:", err));
