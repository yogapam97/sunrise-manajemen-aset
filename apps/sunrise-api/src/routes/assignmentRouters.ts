import express from "express";
import { checkSchema } from "express-validator";

import authMiddleware from "../middlewares/authMiddleware";
import AssignmentService from "../services/AssignmentService";
import workspaceMiddleware from "../middlewares/workspaceMiddleware";
import AssignmentController from "../controllers/AssignmentController";

const router = express.Router();
router.get("/", authMiddleware, workspaceMiddleware, AssignmentController.getAll);
router.get("/:assignmentId", authMiddleware, workspaceMiddleware, AssignmentController.getById);
router.post(
  "/",
  authMiddleware,
  workspaceMiddleware,
  checkSchema(AssignmentService.assignmentValidationSchema),
  AssignmentController.createAssignment
);

router.delete(
  "/:assignmentId",
  authMiddleware,
  workspaceMiddleware,
  AssignmentController.deleteAssignment
);

export default router;
