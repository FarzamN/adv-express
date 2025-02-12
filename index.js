import cors from "cors";
import { join } from "path";
import BP from "body-parser";
import { dirname } from "path";
import passport from "passport";
import { config } from "dotenv";
import { Server } from "socket.io";
import { createServer } from "http";
import { fileURLToPath } from "url";

import express, { json, urlencoded } from "express";
import {
  coreConfig,
  DBConnection,
  sessionConfig,
} from "./src/middleware/index.js";
import {
  authRouter,
  fileRoute,
  messageRoute,
  productRoute,
} from "./src/router/index.js";

config();
DBConnection();

const app = express();
const server = createServer(app); // Create HTTP server
const io = new Server(server, { cors: coreConfig }); // ✅ Pass HTTP Server to Socket.IO

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
app.use("/api/msg", messageRoute);

// Serve the HTML file
const __dirname = dirname(fileURLToPath(import.meta.url));
app.get("/", (req, res) => {
  const filePath = join(__dirname, "./src/frontend/index.html");
  res.sendFile(filePath);
});

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  socket.on("sendMessage", (message) => {
    console.log("Message received:", message);
    io.emit("receiveMessage", message); // Broadcast message to all clients
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected:", socket.id);
  });
});

// Start Server
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
