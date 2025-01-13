import { Router } from "express";
import { createLearn } from "../controller/learnController.js";
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
  createLearn
);

export default mongoRoute;
