import express from "express";
import { checkSchema } from "express-validator";

import AuditService from "../services/AuditService";
import authMiddleware from "../middlewares/authMiddleware";
import AuditController from "../controllers/AuditController";
import workspaceMiddleware from "../middlewares/workspaceMiddleware";

const router = express.Router();
router.get("/", authMiddleware, workspaceMiddleware, AuditController.getAll);
router.get("/:auditId", authMiddleware, workspaceMiddleware, AuditController.getById);
router.post(
  "/",
  authMiddleware,
  workspaceMiddleware,
  checkSchema(AuditService.auditValidationSchema),
  AuditController.createAudit
);

export default router;
