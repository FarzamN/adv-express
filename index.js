import cors from "cors";
import { join } from "path";
import BP from "body-parser";
import { dirname } from "path";
import passport from "passport";
import { config } from "dotenv";
import { fileURLToPath } from "url";
import session from "express-session";
import express, { json, urlencoded } from "express";
import { DBConnection } from "./src/middleware/index.js";
import { authRouter, fileRoute } from "./src/router/index.js";

config();
DBConnection();

const coreConfig = {
  origin: "*",
  credentials: true,
  method: ["GET", "POST", "PUT", "DELETE", "PATCH"],
};
const app = express();
app.use(express.static("public"));

app.use(json());
app.use(cors(coreConfig));
app.use(BP.json());
app.use(urlencoded({ extended: false }));
app.use(BP.json({ type: "application/*+json" }));

const port = process.env.PORT || 3000;
app.use(passport.initialize());

app.use(
  session({
    resave: false,
    saveUninitialized: true,
    secret: process.env.SECRET_KEY,
  }),
  passport.session(),
  passport.initialize()
);
app.use("/api/files", fileRoute);
app.use("/api/auth", authRouter);
// Serve the HTML file

const __dirname = dirname(fileURLToPath(import.meta.url));

app.get("/", (req, res) => {
  const filePath = join(__dirname, "./src/frontend/index.html");
  res.sendFile(filePath);
});

app.listen(port, () => {
  console.log("Server is running on port 3000");
});
