import { Router } from "express";
import {
  commentOfProduct,
  createProduct,
  searchProduct,
} from "../controller/productController.js";
import { authMiddleware, formData } from "../middleware/index.js";
import {
  validateLearn,
  handleValidationErrors,
} from "../middleware/validator.js";

const mongoRoute = Router();

mongoRoute.post(
  "/create",
  authMiddleware,
  formData,
  validateLearn,
  handleValidationErrors,
  createProduct
);

mongoRoute.get("/search", authMiddleware, searchProduct);
mongoRoute.post("/comments", authMiddleware, formData, commentOfProduct);

export default mongoRoute;
