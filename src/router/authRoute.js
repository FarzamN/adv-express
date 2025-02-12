import { Router } from "express";
import { authMiddleware, formData } from "../middleware/index.js";
import {
  validateLogin,
  validateRegister,
  handleValidationErrors,
  validateEmailnPhone,
  validatePhone,
  validateEmail,
} from "../middleware/validator.js";
import {
  login,
  register,
  getAllUser,
  google_login,
  forgetWithEmail,
  forgetWithPhone,
  checkEmailnPhone,
  changePasswordAuth,
  changePassword,
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
  "/check-email-Phone",
  formData,
  validateEmailnPhone,
  handleValidationErrors,
  checkEmailnPhone
);

authRouter.post(
  "/forget-with-email",
  formData,
  validateEmail,
  handleValidationErrors,
  forgetWithEmail
);

authRouter.post(
  "/forget-with-phone",
  formData,
  validatePhone,
  handleValidationErrors,
  forgetWithPhone
);

authRouter.post("/change-password/:id", formData, changePassword);
authRouter.post("/change-password-auth/:id", formData, changePasswordAuth);

authRouter.get(
  "/google-login",
  Passport.authenticate("google", { scope: ["email"] }),
  google_login
);

authRouter.get("/get-all-user", authMiddleware, getAllUser);

export default authRouter;
