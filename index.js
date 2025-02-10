import cors from "cors";
import { join } from "path";
import BP from "body-parser";
import { dirname } from "path";
import passport from "passport";
import { config } from "dotenv";
import { fileURLToPath } from "url";
import session from "express-session";
import express, { json, urlencoded } from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import {
  coreConfig,
  DBConnection,
  sessionConfig,
} from "./src/middleware/index.js";
import { authRouter, fileRoute, productRoute } from "./src/router/index.js";
import { socketHandler } from "./src/socket/socketHandler.js";

config();
DBConnection();

const app = express();
const server = createServer(app); // Create HTTP server
const io = new Server(server, {
  cors: coreConfig, // Enable CORS for Socket.IO
});

app.use(express.static("public"));
app.use(json());
app.use(cors(coreConfig));
app.use(BP.json());
app.use(urlencoded({ extended: false }));
app.use(BP.json({ type: "application/*+json" }));

const port = process.env.PORT || 3000;
app.use(passport.initialize());

app.use(sessionConfig);
app.use("/api/files", fileRoute);
app.use("/api/auth", authRouter);
app.use("/api/products", productRoute);

// Serve the HTML file
const __dirname = dirname(fileURLToPath(import.meta.url));
app.get("/", (req, res) => {
  const filePath = join(__dirname, "./src/frontend/index.html");
  res.sendFile(filePath);
});

// **Socket.IO Connection Logic**
socketHandler(io);

// Start Server
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
