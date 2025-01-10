import { Schema, model } from "mongoose";

const fileModel = new Schema(
  {
    name: String,
    type: String,
    size: Number,
    uploadDate: Date,
    md5: String,
    data: Buffer,
  },
  { timestamps: true }
);

const file = model("File", fileModel);
export default file;
