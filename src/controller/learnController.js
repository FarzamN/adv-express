import asyncHandler from "express-async-handler";
import { Mongo } from "../model/index.js";
import { catchErr } from "../middleware/index.js";

export const createLearn = asyncHandler(async (req, res) => {
  const { title, description } = req.body;
  try {
    const findTitle = await Mongo.findOne({ title });
    console.log("Find Title Query Executed", findTitle);
    if (findTitle) {
      res.status(400).json({
        status: 400,
        message: "Title already exists",
      });
    }
    const data = await Mongo.create({ title, description });
    res.status(200).json({
      data,
      status: 200,
      message: "Learn created successfully",
    });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      error: error.message,
      message: catchErr("createLearn", "auth"),
    });
  }
});

export const searchLearn = asyncHandler(async (req, res) => {});
