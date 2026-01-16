import express from "express";
import { checkSchema } from "express-validator";

import SupplierService from "../services/SupplierService";
import authMiddleware from "../middlewares/authMiddleware";
import SupplierController from "../controllers/SupplierController";
import workspaceMiddleware from "../middlewares/workspaceMiddleware";

const router = express.Router();
router.get("/", authMiddleware, workspaceMiddleware, SupplierController.getAll);
router.get("/:supplierId", authMiddleware, workspaceMiddleware, SupplierController.getById);
router.get(
  "/:supplierId/fixed-assets",
  authMiddleware,
  workspaceMiddleware,
  SupplierController.getFixedAssets
);
router.post(
  "/",
  authMiddleware,
  workspaceMiddleware,
  checkSchema(SupplierService.supplierValidationSchema),
  SupplierController.createSupplier
);
router.patch(
  "/:supplierId",
  authMiddleware,
  workspaceMiddleware,
  checkSchema(SupplierService.supplierValidationSchema),
  SupplierController.updateSupplier
);

router.delete(
  "/:supplierId",
  authMiddleware,
  workspaceMiddleware,
  SupplierController.deleteSupplier
);

export default router;
