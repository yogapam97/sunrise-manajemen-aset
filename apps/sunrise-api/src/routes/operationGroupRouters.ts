import express from "express";
import { checkSchema } from "express-validator";

import authMiddleware from "../middlewares/authMiddleware";
import workspaceMiddleware from "../middlewares/workspaceMiddleware";
import OperationGroupService from "../services/OperationGroupService";
import OperationGroupController from "../controllers/OperationGroupController";

const router = express.Router();
router.get("/", authMiddleware, workspaceMiddleware, OperationGroupController.getAll);
router.get(
  "/:operationGroupId",
  authMiddleware,
  workspaceMiddleware,
  OperationGroupController.getById
);
router.post(
  "/",
  authMiddleware,
  workspaceMiddleware,
  checkSchema(OperationGroupService.operationGroupValidationSchema),
  OperationGroupController.createOperationGroup
);
router.post(
  "/:operationGroupId/do",
  authMiddleware,
  workspaceMiddleware,
  OperationGroupController.createOperationGroupDo
);
router.patch(
  "/:operationGroupId",
  authMiddleware,
  workspaceMiddleware,
  checkSchema(OperationGroupService.operationGroupValidationSchema),
  OperationGroupController.updateOperationGroup
);

router.delete(
  "/:operationGroupId",
  authMiddleware,
  workspaceMiddleware,
  OperationGroupController.deleteOperationGroup
);

export default router;
