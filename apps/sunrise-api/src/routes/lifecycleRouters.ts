import express from "express";
import { checkSchema } from "express-validator";

import authMiddleware from "../middlewares/authMiddleware";
import LifecycleService from "../services/LifecycleService";
import LifecycleController from "../controllers/LifecycleController";
import workspaceMiddleware from "../middlewares/workspaceMiddleware";

const router = express.Router();
router.get("/", authMiddleware, workspaceMiddleware, LifecycleController.getAll);
router.get("/:lifecycleId", authMiddleware, workspaceMiddleware, LifecycleController.getById);
router.get(
  "/:lifecycleId/fixed-assets",
  authMiddleware,
  workspaceMiddleware,
  LifecycleController.getFixedAssets
);
router.post(
  "/",
  authMiddleware,
  workspaceMiddleware,
  checkSchema(LifecycleService.lifecycleValidationSchema),
  LifecycleController.createLifecycle
);
router.patch(
  "/:lifecycleId",
  authMiddleware,
  workspaceMiddleware,
  checkSchema(LifecycleService.lifecycleValidationSchema),
  LifecycleController.updateLifecycle
);

router.delete(
  "/:lifecycleId",
  authMiddleware,
  workspaceMiddleware,
  LifecycleController.deleteLifecycle
);

export default router;
