import chalk from "chalk";
import multer from "multer";
import { config } from "dotenv";
import { connect } from "mongoose";
config();

export const DBConnection = async () => {
  try {
    await connect(process.env.MONGO_URI);
    console.log(
      chalk.hex("#fff").italic("MongoDB is connected")
    );
  } catch (error) {
    console.error(
      chalk.hex("#ff5252").italic(`MongoDB connection error: 💥💥💥 ${error}`)
    );
  }
};

export const catchErr = (data, a) => {
  return `Internal server error in ${data} API, ${a} controller`;
};

export const fromData = multer().none();