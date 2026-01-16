import express from "express";
import { checkSchema } from "express-validator";

import authMiddleware from "../middlewares/authMiddleware";
import TransitionService from "../services/TransitionService";
import workspaceMiddleware from "../middlewares/workspaceMiddleware";
import TransitionController from "../controllers/TransitionController";

const router = express.Router();
router.get("/", authMiddleware, workspaceMiddleware, TransitionController.getAll);
router.get("/:transitionId", authMiddleware, workspaceMiddleware, TransitionController.getById);
router.post(
  "/",
  authMiddleware,
  workspaceMiddleware,
  checkSchema(TransitionService.transitionValidationSchema),
  TransitionController.createTransition
);

router.delete(
  "/:transitionId",
  authMiddleware,
  workspaceMiddleware,
  TransitionController.deleteTransition
);

export default router;
