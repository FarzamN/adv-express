import { Schema, model } from "mongoose";

const product = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

product.index({ title: "text", description: "text", price: "text" });
const productModel = model("product", product);
export default productModel;
