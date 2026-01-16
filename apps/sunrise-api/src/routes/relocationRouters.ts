import express from "express";
import { checkSchema } from "express-validator";

import authMiddleware from "../middlewares/authMiddleware";
import RelocationService from "../services/RelocationService";
import workspaceMiddleware from "../middlewares/workspaceMiddleware";
import RelocationController from "../controllers/RelocationController";

const router = express.Router();
router.get("/", authMiddleware, workspaceMiddleware, RelocationController.getAll);
router.get("/:relocationId", authMiddleware, workspaceMiddleware, RelocationController.getById);
router.post(
  "/",
  authMiddleware,
  workspaceMiddleware,
  checkSchema(RelocationService.relocationValidationSchema),
  RelocationController.createRelocation
);

router.delete(
  "/:relocationId",
  authMiddleware,
  workspaceMiddleware,
  RelocationController.deleteRelocation
);

export default router;
