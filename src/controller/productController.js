import asyncHandler from "express-async-handler";
import { product } from "../model/index.js";
import { catchErr } from "../middleware/index.js";

export const createProduct = asyncHandler(async (req, res) => {
  const { title, description, price } = req.body;
  try {
    const findTitle = await product.findOne({ title });
    console.log("findTitle", await product.findOne({ title }));
    if (findTitle) {
      return res.status(400).json({
        status: 400,
        message: "Title already exists",
      });
    }
    const data = await product.create({ title, description, price });
    return res.status(200).json({
      data,
      status: 200,
      message: "Learn created successfully",
    });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      error: error.message,
      message: catchErr("createLearn", "learn"),
    });
  }
});

export const searchProduct = asyncHandler(async (req, res) => {
  const { keyword = "", startPrice = 0, endPrice = Infinity } = req.params;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  try {
    const query = {};
    if (keyword.trim()) {
      query.$text = { $search: keyword.trim() };
    }
    if (startPrice || endPrice) {
      query.price = {
        $gte: parseFloat(startPrice),
        $lte: parseFloat(endPrice),
      };
    }
    const data = await product.find(query).skip(skip).limit(limit);
    const totalCount = await product.countDocuments(query);
    res.status(200).json({
      data,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalCount / limit),
        totalItems: totalCount,
      },
      status: 200,
      message: "Learn fetched successfully",
    });
  } catch (error) {
    res.status(500).json({
      status: 500,
      error: error.message,
      message: catchErr("searchProduct", "learn"),
    });
  }
});

export const commentOfProduct = asyncHandler(async (req, res) => {
  const { comment, id } = req.body;
  console.log({ id });
  try {
    const data = await product.findByIdAndUpdate(
      id,
      { $push: { comments: comment } },
      { new: true }
    );
    return res.status(200).json({
      data,
      status: 200,
      message: "Comment added successfully",
    });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      error: error.message,
      message: catchErr("commentOfProduct", "learn"),
    });
  }
});
