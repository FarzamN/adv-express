import chalk from "chalk";
import multer from "multer";
import jwt from "jsonwebtoken";
import { config } from "dotenv";
import { randomInt } from "crypto";
import session from "express-session";
import { connect, plugin } from "mongoose";
import { compareSync, genSalt, hash } from "bcrypt";

config();

// plugin((schema) => {
//   schema.set("toJSON", {
//     transform: (doc, ret) => {
//       ret.id = ret._id;
//       delete ret._id;
//       delete ret.__v;
//     },
//   });
// });

export const coreConfig = {
  origin: "*",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
};

export const sessionConfig = session({
  resave: false,
  saveUninitialized: true,
  secret: process.env.SECRET_KEY,
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

export const catchErr = (data, a) =>
  `Internal server error in ${data} API, ${a} controller`;

export const formData = multer().none();

export const authMiddleware = (req, res, next) => {
  const header = req.header("Authorization");
  const token = header && header.split(" ")[1];

  if (!token) {
    return res
      .status(401)
      .json({ status: 401, message: "No token, authorization denied" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.id;
    next();
  } catch (error) {
    res.status(401).json({ status: 401, message: "Invalid token" });
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

export const otp =  randomInt(1000, 9999)