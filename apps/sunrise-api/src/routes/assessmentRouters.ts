import express from "express";
import { checkSchema } from "express-validator";

import authMiddleware from "../middlewares/authMiddleware";
import AssessmentService from "../services/AssessmentService";
import workspaceMiddleware from "../middlewares/workspaceMiddleware";
import AssessmentController from "../controllers/AssessmentController";

const router = express.Router();
router.get("/", authMiddleware, workspaceMiddleware, AssessmentController.getAll);
router.get("/:assessmentId", authMiddleware, workspaceMiddleware, AssessmentController.getById);
router.post(
  "/",
  authMiddleware,
  workspaceMiddleware,
  checkSchema(AssessmentService.assessmentValidationSchema),
  AssessmentController.createAssessment
);

router.delete(
  "/:assessmentId",
  authMiddleware,
  workspaceMiddleware,
  AssessmentController.deleteAssessment
);

export default router;
