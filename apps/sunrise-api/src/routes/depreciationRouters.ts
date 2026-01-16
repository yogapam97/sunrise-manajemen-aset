import express from "express";

import authMiddleware from "../middlewares/authMiddleware";
import workspaceMiddleware from "../middlewares/workspaceMiddleware";
import DepreciationController from "../controllers/DepreciationController";

const router = express.Router();
router.get("/", authMiddleware, workspaceMiddleware, DepreciationController.getAll);
router.get("/:depreciationId", authMiddleware, workspaceMiddleware, DepreciationController.getById);

export default router;
