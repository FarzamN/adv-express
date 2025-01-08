import express from "express";
import session from "express-session";
import {config} from "dotenv";
import passport from "passport";

config();

const app = express();

app.use(session({
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: true,

}), passport.initialize(), passport.session());

app.get("/", (req, res) => {
    req.session.count ++
    console.log(req.session);
    res.send("Please signin or register");
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
