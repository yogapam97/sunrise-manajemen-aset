import express from "express";

import authMiddleware from "../middlewares/authMiddleware";
import workspaceMiddleware from "../middlewares/workspaceMiddleware";
import FixedAssetController from "../controllers/FixedAssetController";

const router = express.Router();
router.get("/", authMiddleware, workspaceMiddleware, FixedAssetController.downloadFixedAsset);

export default router;
