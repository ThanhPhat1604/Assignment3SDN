import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import axios from "axios";
import User from "../models/User";
import { RegisterDTO, LoginDTO, JWTPayload } from "../types"; // ✅ Import types

const JWT_SECRET = process.env.JWT_SECRET || "secret";

// ============== HELPER: Generate JWT Token ==============
const generateToken = (payload: JWTPayload): string => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
};

// ============== REGISTER ==============
export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password, role } = req.body as RegisterDTO;

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide name, email, and password",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters",
      });
    }

    // Check existing user
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = new User({
      name,
      email,
      password: hashedPassword,
      role: role || "user",
    });
    await user.save();

    // Generate token
    const token = generateToken({
      id: user._id.toString(),
      role: user.role,
    });

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("❌ Register error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error,
    });
  }
};

// ============== LOGIN ==============
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body as LoginDTO;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide email and password",
      });
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user || !user.password) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Generate token
    const token = generateToken({
      id: user._id.toString(),
      role: user.role,
    });

    res.json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        image: user.image,
      },
    });
  } catch (error) {
    console.error("❌ Login error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error,
    });
  }
};

// ============== GOOGLE LOGIN ==============
export const googleLogin = async (req: Request, res: Response) => {
  const { accessToken } = req.body;

  try {
    // Get user info from Google
    const googleRes = await axios.get<{
      email: string;
      name: string;
      picture?: string;
    }>(
      `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${accessToken}`
    );

    const { email, name, picture } = googleRes.data;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Invalid Google data",
      });
    }

    // Find or create user
    let user = await User.findOne({ email });
    if (!user) {
      user = new User({
        email,
        name,
        image: picture,
        role: "user",
      });
      await user.save();
    } else {
      // Update user info
      user.name = name;
      user.image = picture;
      await user.save();
    }

    // Generate token
    const token = generateToken({
      id: user._id.toString(),
      role: user.role,
    });

    return res.json({
      success: true,
      message: "Google login successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        image: user.image,
      },
      token,
    });
  } catch (error) {
    console.error("❌ Google login error:", error);
    return res.status(401).json({
      success: false,
      message: "Invalid Google token",
    });
  }
};