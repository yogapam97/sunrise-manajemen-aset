import express from "express";
import { checkSchema } from "express-validator";

import authMiddleware from "../middlewares/authMiddleware";
import WorkspaceService from "../services/WorkspaceService";
import memberMiddleware from "../middlewares/memberMiddleware";
import WorkspaceController from "../controllers/WorkspaceController";
import workspaceMiddleware from "../middlewares/workspaceMiddleware";

const router = express.Router();
router.get("/", authMiddleware, WorkspaceController.getAll);
router.get("/:workspaceId", authMiddleware, memberMiddleware, WorkspaceController.getById);
router.get(
  "/:workspaceId/me",
  authMiddleware,
  workspaceMiddleware,
  memberMiddleware,
  WorkspaceController.getMe
);
router.get(
  "/:workspaceId/select",
  authMiddleware,
  workspaceMiddleware,
  memberMiddleware,
  WorkspaceController.selectWorkspace
);
router.post(
  "/",
  authMiddleware,
  checkSchema(WorkspaceService.workspaceCreateValidation),
  WorkspaceController.createWorkspace
);
router.patch(
  "/:workspaceId",
  authMiddleware,
  memberMiddleware,
  WorkspaceController.updateWorkspace
);
router.delete("/:workspaceId", authMiddleware, WorkspaceController.deleteWorkspace);
router.post(
  "/:workspaceId/invite",
  authMiddleware,
  memberMiddleware,
  checkSchema(WorkspaceService.workspaceInviteValidation),
  WorkspaceController.invite
);
router.get(
  "/:workspaceId/members",
  authMiddleware,
  memberMiddleware,
  WorkspaceController.getAllMembers
);
router.get(
  "/:workspaceId/members/:memberId",
  authMiddleware,
  memberMiddleware,
  WorkspaceController.getMemberById
);

router.post(
  "/:workspaceId/accept-invitation",
  authMiddleware,
  WorkspaceController.acceptInvitation
);

router.post(
  "/:workspaceId/reject-invitation",
  authMiddleware,
  WorkspaceController.rejectInvitation
);

router.patch(
  "/:workspaceId/members/:memberId",
  authMiddleware,
  memberMiddleware,
  checkSchema(WorkspaceService.memberEditValidation),
  WorkspaceController.updateMember
);
router.delete(
  "/:workspaceId/members/:memberId",
  authMiddleware,
  memberMiddleware,
  WorkspaceController.deleteMember
);

export default router;
