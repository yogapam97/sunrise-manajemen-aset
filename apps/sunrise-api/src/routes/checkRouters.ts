import express from "express";
import { checkSchema } from "express-validator";

import CheckService from "../services/CheckService";
import authMiddleware from "../middlewares/authMiddleware";
import CheckController from "../controllers/CheckController";
import workspaceMiddleware from "../middlewares/workspaceMiddleware";

const router = express.Router();
router.get("/", authMiddleware, workspaceMiddleware, CheckController.getAll);
router.get("/:checkId", authMiddleware, workspaceMiddleware, CheckController.getById);
router.post(
  "/",
  authMiddleware,
  workspaceMiddleware,
  checkSchema(CheckService.checkValidationSchema),
  CheckController.createCheck
);

export default router;
