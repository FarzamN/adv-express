import express,{ json, urlencoded } from "express";
import session from "express-session";
import {config} from "dotenv";
import passport from "passport";
import { DBConnection } from "./src/config/index.js";
import BP from "body-parser";
import cors from "cors";

config();
DBConnection()

const app = express();
app.use(express.static('public'))

app.use(json());
app.use(cors());
app.use(BP.json());
app.use(urlencoded({ extended: false }));
app.use(BP.json({ type: "application/*+json" }));

const port = process.env.PORT || 3000;

app.use(session({
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: true,

}), passport.initialize(), passport.session());

app.get("/", (req, res) => {
    res.send("Please signin or register");
});

app.listen(port, () => {
  console.log("Server is running on port 3000");
});
