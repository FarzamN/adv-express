import { Router } from "express";
import {
  formData,
  handleValidationErrors,
  validateLogin,
  validateRegister,
} from "../middleware/index.js";
import { login, register, google_login } from "../controller/authController.js";

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

authRouter.post("/google-login", formData, google_login);

export default authRouter;
