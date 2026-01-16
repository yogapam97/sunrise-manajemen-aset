import express from "express";
import { checkSchema } from "express-validator";

import MetricService from "../services/MetricService";
import authMiddleware from "../middlewares/authMiddleware";
import MetricController from "../controllers/MetricController";
import workspaceMiddleware from "../middlewares/workspaceMiddleware";

const router = express.Router();
router.get("/", authMiddleware, workspaceMiddleware, MetricController.getAll);
router.get("/:metricId", authMiddleware, workspaceMiddleware, MetricController.getById);
router.post(
  "/",
  authMiddleware,
  workspaceMiddleware,
  checkSchema(MetricService.metricValidationSchema),
  MetricController.createMetric
);
router.patch(
  "/:metricId",
  authMiddleware,
  workspaceMiddleware,
  checkSchema(MetricService.metricUpdateValidationSchema),
  MetricController.updateMetric
);

router.delete("/:metricId", authMiddleware, workspaceMiddleware, MetricController.deleteMetric);

export default router;
