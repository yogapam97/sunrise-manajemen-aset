import express from "express";
import { checkSchema } from "express-validator";

import MemberService from "../services/MemberService";
import authMiddleware from "../middlewares/authMiddleware";
import WorkspaceService from "../services/WorkspaceService";
import MemberController from "../controllers/MemberController";
import memberMiddleware from "../middlewares/memberMiddleware";
import workspaceMiddleware from "../middlewares/workspaceMiddleware";

const router = express.Router();
router.post(
  "/",
  authMiddleware,
  workspaceMiddleware,
  memberMiddleware,
  checkSchema(MemberService.memberInviteValidation),
  MemberController.invite
);
router.get("/", authMiddleware, workspaceMiddleware, MemberController.getAll);
router.get("/:memberId", authMiddleware, workspaceMiddleware, MemberController.getById);
router.get(
  "/:memberId/fixed-assets",
  authMiddleware,
  workspaceMiddleware,
  MemberController.getFixedAssets
);
router.post(
  "/:memberId/accept-invitation",
  authMiddleware,
  workspaceMiddleware,
  MemberController.acceptInvitation
);
router.post(
  "/:memberId/resend-invitation",
  authMiddleware,
  workspaceMiddleware,
  MemberController.resendInvitation
);

router.post(
  "/:memberId/reset-password",
  authMiddleware,
  memberMiddleware,
  MemberController.resetPassword
);
router.patch(
  "/:memberId",
  authMiddleware,
  memberMiddleware,
  checkSchema(WorkspaceService.memberEditValidation),
  MemberController.updateMember
);
router.delete("/:memberId", authMiddleware, workspaceMiddleware, MemberController.deleteMember);

export default router;
