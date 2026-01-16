import express from "express";

import authMiddleware from "../middlewares/authMiddleware";
import workspaceMiddleware from "../middlewares/workspaceMiddleware";
import OperationLogController from "../controllers/OperationLogController";

const router = express.Router();
router.get("/", authMiddleware, workspaceMiddleware, OperationLogController.downloadOperationLog);

export default router;
