import express from "express";
import { checkSchema } from "express-validator";

import HashtagService from "../services/HashtagService";
import authMiddleware from "../middlewares/authMiddleware";
import HashtagController from "../controllers/HashtagController";
import workspaceMiddleware from "../middlewares/workspaceMiddleware";

const router = express.Router();
router.get("/", authMiddleware, workspaceMiddleware, HashtagController.getAll);
router.get("/:hashtagId", authMiddleware, workspaceMiddleware, HashtagController.getById);
router.post(
  "/",
  authMiddleware,
  workspaceMiddleware,
  checkSchema(HashtagService.hashtagValidationSchema),
  HashtagController.createHashtag
);

router.delete("/:hashtagId", authMiddleware, workspaceMiddleware, HashtagController.deleteHashtag);

export default router;
