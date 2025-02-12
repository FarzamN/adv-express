import {
  otp,
  genToken,
  catchErr,
  comparePassword,
  hashingPassword,
} from "../middleware/index.js";

import jwt from "jsonwebtoken";
import passport from "passport";
import { User } from "../model/index.js";
import asyncHandler from "express-async-handler";
import { Strategy as google } from "passport-google-oauth2";

const clientID =
  "1032121719365-0iuvmoiivmr4sg6qbt560m1hqa62lfg7.apps.googleusercontent.com";
const clientSecret = "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";
const callbackURL = "https://www.youtube.com";

passport.use(
  new google(
    { clientID, clientSecret, callbackURL, passReqToCallback: true },
    function (request, accessToken, refreshToken, profile, done) {
      User.findOrCreate({ googleId: profile.id }, (err, user) =>
        done(err, user, profile)
      );
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user);
});
passport.deserializeUser((user, done) => {
  done(null, user);
});

export const google_login = asyncHandler(async (req, res) => {
  return res.send("Logged in with Google!");
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ status: 400, message: "Invalid credentials" });
    }

    const isMatch = comparePassword(password, user.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ status: 400, message: "Invalid credentials" });
    }

    const token = genToken(user.id);
    return res
      .status(200)
      .json({ status: 200, token, data: user, message: "Login successful" });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      error: error.message,
      message: catchErr("login", "auth"),
    });
  }
});

export const register = asyncHandler(async (req, res) => {
  const { name, email, password, phone } = req.body;

  try {
    const emailExist = await User.findOne({ email });
    const phoneExist = await User.findOne({ phone });

    if (emailExist || phoneExist) {
      return res.status(400).json({
        status: 400,
        message: `${emailExist ? "email" : "phone"} already exists`,
      });
    }

    const hashed = await hashingPassword(password);

    // Create the user first
    const user = await User.create({ name, email, password: hashed, phone });

    // Generate the token after the user is created
    const payload = { id: user._id };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    if (user) {
      return res.status(201).json({
        token,
        data: user,
        status: 200,
      });
    }
  } catch (error) {
    return res.status(500).json({
      status: 500,
      error: error.message,
      message: catchErr("register", "auth"),
    });
  }
});

export const checkEmailnPhone = asyncHandler(async (req, res) => {
  const { email, phone } = req.body;

  try {
    const emailExist = await User.findOne({ email });
    const phoneExist = await User.findOne({ phone });

    if (emailExist || phoneExist) {
      return res.status(400).json({
        status: 400,
        message: `${emailExist ? "email" : "phone"} already exists`,
      });
    }

    return res.status(200).json({
       otp,
      status: 200,
      message: "User does not exist",
    });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      error: error.message,
      message: catchErr("checkEmailnPhone", "auth"),
    });
  }
});

export const getAllUser = asyncHandler(async (req, res) => {
  try {
    const users = await User.find();
    return res.status(200).json({ status: 200, data: users });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      error: error.message,
      message: catchErr("getAllUser", "auth"),
    });
  }
});

export const forgetWithEmail = asyncHandler(async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        status: 400,
        message: "Email not Found ",
      });
    }
    return res.status(200).json({
      otp,
      data: user,
      status: 200,
      message: "email verified",
    });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      error: error.message,
      message: catchErr("forgetWithEmail", "auth"),
    });
  }
});

export const forgetWithPhone = asyncHandler(async (req, res) => {
  const { phone } = req.body;

  try {
    const user = await User.findOne({ phone });
    if (!user) {
      return res.status(400).json({
        status: 400,
        message: "Phone number not Found ",
      });
    }
    return res.status(200).json({
      otp,
      data: user,
      status: 200,
      message: "Phone number verified",
    });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      error: error.message,
      message: catchErr("forgetWithPhone", "auth"),
    });
  }
});

export const changePasswordAuth = asyncHandler(async (req, res) => {
  const { password } = req.body;
  const { id } = req.params;
  try {
    const user = await User.findById(id);
    if (!user) res.status(400).json({ status: 400, message: "User not found" });
    const hashedPassword = await hashingPassword(password);

    user.password = hashedPassword;
    const data = await user.save();
    return res.status(200).json({
      data,
      status: 200,
      message: "Password has been updated!",
    });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      error: error.message,
      message: catchErr("changePasswordAuth", "auth"),
    });
  }
});

export const changePassword = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { oldPassword, password } = req.body;
  try {
    const user = await User.findById(id);
    if (!user) res.status(400).json({ status: 400, message: "User not found" });
    const isMatch = comparePassword(oldPassword, user.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ status: 400, message: "Invalid credentials" });
    }
    const hashedPassword = await hashingPassword(password);

    user.password = hashedPassword;
    const data = await user.save();

    return res.status(200).json({
      data,
      status: 200,
      message: "Password has been updated!",
    });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      error: error.message,
      message: catchErr("changePassword", "auth"),
    });
  }
});
