import { Router } from "express";
import { authMiddleware, formData } from "../middleware/index.js";
import {
  validateLogin,
  validateRegister,
  handleValidationErrors,
  validateEmailnPhone,
} from "../middleware/validator.js";
import {
  login,
  register,
  getAllUser,
  google_login,
  checkEmailnPhone,
} from "../controller/authController.js";
import Passport from "passport";

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

authRouter.post(
  "/checkEmailnPhone",
  formData,
  validateEmailnPhone,
  handleValidationErrors,
  checkEmailnPhone
);

authRouter.get(
  "/google-login",
  Passport.authenticate("google", { scope: ["email"] }),
  google_login
);
authRouter.get("/get-all-user", authMiddleware, getAllUser);

export default authRouter;
