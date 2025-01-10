import fs from "fs";
import asyncHandler from "express-async-handler";
import { catchErr } from "../middleware/index.js";

export const get_file = asyncHandler(async (req, res) => {
  const file = req.params.file;
  res.sendFile(file, { root: "uploads" });
});

export const get_all_file = asyncHandler(async (req, res) => {
  const file = req.params.file;
  res.sendFile(file, { root: "uploads" });
});

export const upload_file = asyncHandler(async (req, res) => {
  const file = req.file;
  const { name } = req.body;

  try {
    res.status(200).json({
      status: 200,
      message: "File uploaded successfully",
      data: {
        name,
        file,
        size: file.size,
        type: file.mimetype,
      },
    });

    // Create a GridFS bucket

    // Upload a file
  } catch (error) {
    res.status(500).json({
      error: error.message,
      status: 500,
      message: catchErr("upload", "upload_file"),
    });
  }
});

export const delete_file = asyncHandler(async (req, res) => {
  const file = req.params.file;
  if (!file) {
    return res.status(400).json({ status: 400, message: "No file uploaded" });
  }
  return res.status(200).json({ status: 200, data: file });
});
