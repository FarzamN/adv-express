import { Router } from "express";
import { authMiddleware, formData } from "../middleware/index.js";
import {
  upload_file,
  get_file,
  get_all_file,
  delete_file,
} from "../controller/fileController.js";
import {
  handleValidationErrors,
  validateFile,
} from "../middleware/validator.js";
import { upload } from "../middleware/multer.js";

const fileRoute = Router();

fileRoute.post(
  "/upload-file",
  authMiddleware,
  upload.single("file"),
  validateFile,
  handleValidationErrors,
  upload_file
);
fileRoute.get("/get-file", authMiddleware, get_file);
fileRoute.get("/get-all-file", authMiddleware, get_all_file);
fileRoute.delete("/delete-file", authMiddleware, delete_file);

export default fileRoute;
