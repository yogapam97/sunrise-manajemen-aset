import express from "express";
import { checkSchema } from "express-validator";

import authMiddleware from "../middlewares/authMiddleware";
import MaintenanceService from "../services/MaintenanceService";
import workspaceMiddleware from "../middlewares/workspaceMiddleware";
import MaintenanceController from "../controllers/MaintenanceController";

const router = express.Router();
router.get("/", authMiddleware, workspaceMiddleware, MaintenanceController.getAll);
router.get("/:maintenanceId", authMiddleware, workspaceMiddleware, MaintenanceController.getById);
router.post(
  "/",
  authMiddleware,
  workspaceMiddleware,
  checkSchema(MaintenanceService.maintenanceValidationSchema),
  MaintenanceController.createMaintenance
);

export default router;
