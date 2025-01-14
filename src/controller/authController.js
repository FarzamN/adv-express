import { User } from "../model/index.js";
import asyncHandler from "express-async-handler";
import {
  genToken,
  catchErr,
  comparePassword,
  hashingPassword,
} from "../middleware/index.js";
import { Strategy as google } from "passport-google-oauth2";
import passport from "passport";
import { randomInt } from "crypto";
import jwt from "jsonwebtoken";

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
  res.send("Logged in with Google!");
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      res.status(400).json({ status: 400, message: "Invalid credentials" });
    }

    const isMatch = comparePassword(password, user.password);
    if (!isMatch) {
      res.status(400).json({ status: 400, message: "Invalid credentials" });
    }

    const token = genToken(user.id);
    res
      .status(200)
      .json({ status: 200, token, data: user, message: "Login successful" });
  } catch (error) {
    res.status(500).json({
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

    if (!emailExist || !phoneExist) {
      res.status(400).json({
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
      res.status(201).json({
        token,
        data: user,
        status: 200,
      });
    }
  } catch (error) {
    res.status(500).json({
      status: 500,
      error: error.message,
      message: catchErr("register", "auth"),
    });
  }
});

export const checkEmailnPhone = asyncHandler(async (req, res) => {
  const { email, phone } = req.body;

  try {
    const user = await User.findOne({ $or: [{ email }, { phone }] });
    if (user) {
      res.status(401).json({
        status: 401,
        message: "User already exists",
      });
    }
    res.status(200).json({
      status: 200,
      otp: randomInt(1000, 9999),
      message: "User does not exist",
    });
  } catch (error) {
    res.status(500).json({
      status: 500,
      error: error.message,
      message: catchErr("checkEmailnPhone", "auth"),
    });
  }
});

export const getAllUser = asyncHandler(async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json({ status: 200, data: users });
  } catch (error) {
    res.status(500).json({
      status: 500,
      error: error.message,
      message: catchErr("getAllUser", "auth"),
    });
  }
});
