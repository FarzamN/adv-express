import { Router } from "express";
import { send_msg } from "../controller/msgController.js";
import { authMiddleware } from "../middleware/index.js";


const msgRoute = Router();

msgRoute.get("/send-msg:/id", authMiddleware, send_msg);

export default msgRoute;

