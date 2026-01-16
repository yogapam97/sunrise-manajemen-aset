import express from "express";

import authMiddleware from "../middlewares/authMiddleware";
import workspaceMiddleware from "../middlewares/workspaceMiddleware";
import FixedAssetController from "../controllers/FixedAssetController";

const router = express.Router();
router.get("/", authMiddleware, workspaceMiddleware, FixedAssetController.getAll);
router.get("/count", authMiddleware, workspaceMiddleware, FixedAssetController.getReportCount);
router.get(
  "/total-purchase-cost",
  authMiddleware,
  workspaceMiddleware,
  FixedAssetController.getReportTotalPurchaseCost
);
router.get(
  "/total-depreciation",
  authMiddleware,
  workspaceMiddleware,
  FixedAssetController.getReportTotalDepreciation
);

export default router;
