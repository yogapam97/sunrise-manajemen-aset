import express from "express";

import authMiddleware from "../middlewares/authMiddleware";
import CheckController from "../controllers/CheckController";
import workspaceMiddleware from "../middlewares/workspaceMiddleware";

const router = express.Router();
router.get("/", authMiddleware, workspaceMiddleware, CheckController.downloadCheck);

export default router;
