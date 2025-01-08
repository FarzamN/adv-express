import { Router } from "express";
import {
  formData,
  handleValidationErrors,
  validateLogin,
  validateRegister,
} from "../middleware/index.js";
import { login, register } from "../controller/authController.js";

const authRouter = Router();

authRouter.post(
  "/login",
  formData,
  validateLogin,
  handleValidationErrors,
  login
);
authRouter.post(
  "/register",
  formData,
  validateRegister,
  handleValidationErrors,
  register
);

export default authRouter;
