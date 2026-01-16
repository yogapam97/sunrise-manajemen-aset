import express from "express";
import { checkSchema } from "express-validator";

import authMiddleware from "../middlewares/authMiddleware";
import FixedAssetService from "../services/FixedAssetService";
import workspaceMiddleware from "../middlewares/workspaceMiddleware";
import FixedAssetController from "../controllers/FixedAssetController";

const router = express.Router();
router.get("/", authMiddleware, workspaceMiddleware, FixedAssetController.getAll);
router.get("/:fixedAssetId", authMiddleware, workspaceMiddleware, FixedAssetController.getById);
router.post(
  "/",
  authMiddleware,
  workspaceMiddleware,
  checkSchema(FixedAssetService.fixedAssetValidationSchema),
  FixedAssetController.createFixedAsset
);
router.patch(
  "/:fixedAssetId",
  authMiddleware,
  workspaceMiddleware,
  checkSchema(FixedAssetService.fixedAssetValidationSchema),
  FixedAssetController.updateFixedAsset
);

router.delete(
  "/:fixedAssetId",
  authMiddleware,
  workspaceMiddleware,
  FixedAssetController.deleteFixedAsset
);

export default router;
