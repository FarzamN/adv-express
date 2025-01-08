import jwt from "jsonwebtoken";
import { User } from "../model/index.js";
import asyncHandler from "express-async-handler";
import {
  catchErr,
  comparePassword,
  hashingPassword,
} from "../middleware/index.js";

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = comparePassword(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate JWT
    const payload = { id: user._id };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(200).json({ token, data: user, message: "Login successful" });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      error: error.message,
      message: catchErr("login", "auth"),
    });
  }
});
export const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const userExist = await User.findOne({ email });
    if (userExist) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashed = await hashingPassword(password);

    const user = await User.create({ name, email, password: hashed });
    if (user) {
      return res.status(201).json({
        name: user.name,
        email: user.email,
        password: hashed,
      });
    }
  } catch (error) {
    return res.status(500).json({
      status: 500,
      error: error.message,
      message: catchErr("register", "auth"),
    });
  }
});
