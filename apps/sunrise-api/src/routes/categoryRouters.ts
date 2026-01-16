import express from "express";
import { checkSchema } from "express-validator";

import CategoryService from "../services/CategoryService";
import authMiddleware from "../middlewares/authMiddleware";
import CategoryController from "../controllers/CategoryController";
import workspaceMiddleware from "../middlewares/workspaceMiddleware";

const router = express.Router();
router.get("/", authMiddleware, workspaceMiddleware, CategoryController.getAll);
router.get("/:categoryId", authMiddleware, workspaceMiddleware, CategoryController.getById);
router.get(
  "/:categoryId/fixed-assets",
  authMiddleware,
  workspaceMiddleware,
  CategoryController.getFixedAssets
);
router.post(
  "/",
  authMiddleware,
  workspaceMiddleware,
  checkSchema(CategoryService.categoryValidationSchema),
  CategoryController.createCategory
);
router.patch(
  "/:categoryId",
  authMiddleware,
  workspaceMiddleware,
  checkSchema(CategoryService.categoryValidationSchema),
  CategoryController.updateCategory
);

router.delete(
  "/:categoryId",
  authMiddleware,
  workspaceMiddleware,
  CategoryController.deleteCategory
);

export default router;
