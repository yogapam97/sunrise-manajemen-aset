import express from "express";
import { checkSchema } from "express-validator";

import authMiddleware from "../middlewares/authMiddleware";
import FixedAssetService from "../services/FixedAssetService";
import workspaceMiddleware from "../middlewares/workspaceMiddleware";
import FixedAssetController from "../controllers/FixedAssetController";

const router = express.Router();
router.post(
  "/",
  authMiddleware,
  workspaceMiddleware,
  checkSchema(FixedAssetService.fixedAssetImportValidationSchema),
  FixedAssetController.importFixedAsset
);

export default router;
