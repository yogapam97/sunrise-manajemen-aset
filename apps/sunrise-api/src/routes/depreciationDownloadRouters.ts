import express from "express";

import authMiddleware from "../middlewares/authMiddleware";
import workspaceMiddleware from "../middlewares/workspaceMiddleware";
import DepreciationController from "../controllers/DepreciationController";

const router = express.Router();
router.get("/", authMiddleware, workspaceMiddleware, DepreciationController.downloadDepreciation);

export default router;
