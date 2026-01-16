import express from "express";
import { checkSchema } from "express-validator";

import GoalService from "../services/GoalService";
import GoalController from "../controllers/GoalController";
import authMiddleware from "../middlewares/authMiddleware";
import workspaceMiddleware from "../middlewares/workspaceMiddleware";

const router = express.Router();
router.get("/", authMiddleware, workspaceMiddleware, GoalController.getAll);
router.get("/:goalId", authMiddleware, workspaceMiddleware, GoalController.getById);
router.post(
  "/",
  authMiddleware,
  workspaceMiddleware,
  checkSchema(GoalService.goalValidationSchema),
  GoalController.createGoal
);
router.patch(
  "/:goalId",
  authMiddleware,
  workspaceMiddleware,
  checkSchema(GoalService.goalValidationSchema),
  GoalController.updateGoal
);

router.delete("/:goalId", authMiddleware, workspaceMiddleware, GoalController.deleteGoal);

export default router;
