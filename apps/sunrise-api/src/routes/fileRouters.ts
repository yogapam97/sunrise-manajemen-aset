import express from "express";
import { checkSchema } from "express-validator";

import FileService from "../services/FileService";
import authMiddleware from "../middlewares/authMiddleware";
import FileController from "../controllers/FileController";

const router = express.Router();

router.post(
  "/",
  authMiddleware,
  checkSchema(FileService.fileValidationSchema),
  FileController.upload
);
router.get("/:file", FileController.getFile);

export default router;
