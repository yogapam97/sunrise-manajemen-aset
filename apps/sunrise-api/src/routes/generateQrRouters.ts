import express from "express";
import { checkSchema } from "express-validator";

import authMiddleware from "../middlewares/authMiddleware";
import GenerateQrService from "../services/GenerateQrService";
import GenerateQrController from "../controllers/GenerateQrController";

const router = express.Router();

router.post(
  "/",
  authMiddleware,
  checkSchema(GenerateQrService.generateQrValidationSchema),
  GenerateQrController.generateQrs
);

export default router;
