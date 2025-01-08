import chalk from "chalk";
import multer from "multer";
import jwt from "jsonwebtoken";
import { config } from "dotenv";
import { connect, plugin } from "mongoose";
import { body, validationResult } from "express-validator";
import { compareSync, genSalt, hash } from "bcrypt";

config();

plugin((schema) => {
  schema.set("toJSON", {
    transform: (doc, ret) => {
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;
    },
  });
});

export const DBConnection = async () => {
  try {
    await connect(process.env.MONGO_URI);
    console.log(chalk.hex("#fff").italic("MongoDB is connected"));
  } catch (error) {
    console.error(
      chalk.hex("#ff5252").italic(`MongoDB connection error: 💥💥💥 ${error}`)
    );
  }
};

export const catchErr = (data, a) => {
  return `Internal server error in ${data} API, ${a} controller`;
};

export const formData = multer().none();

// Validation middleware for the register route
export const validateRegister = [
  body("name")
    .notEmpty()
    .withMessage("Name is required")
    .isLength({ min: 3 })
    .withMessage("Name must be at least 3 characters long"),
  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email format"),
  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
];

export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ status: 400, errors: errors.array() });
  }
  next();
};

export const validateLogin = [
  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email format"),
  body("password").notEmpty().withMessage("Password is required"),
];

export const authMiddleware = (req, res, next) => {
  const token = req.header("Authorization");

  if (!token) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.id;
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
};

export const hashingPassword = async (password) => {
  const salt = await genSalt(10);
  return hash(password, salt);
};

export const comparePassword = (password, hashedPassword) => {
  return compareSync(password, hashedPassword);
};

export const genToken = (id) => {
  const payload = { id };
  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
  return token;
};
