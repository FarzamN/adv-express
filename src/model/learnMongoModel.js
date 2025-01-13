import { Schema, model } from "mongoose";

const learnMongo = new Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Mongo = model("learnMongo", learnMongo);
export default Mongo;
