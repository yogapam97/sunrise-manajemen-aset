import express from "express";
import { checkSchema } from "express-validator";

import LocationService from "../services/LocationService";
import authMiddleware from "../middlewares/authMiddleware";
import LocationController from "../controllers/LocationController";
import workspaceMiddleware from "../middlewares/workspaceMiddleware";

const router = express.Router();
router.get("/", authMiddleware, workspaceMiddleware, LocationController.getAll);
router.get("/:locationId", authMiddleware, workspaceMiddleware, LocationController.getById);
router.get(
  "/:locationId/fixed-assets",
  authMiddleware,
  workspaceMiddleware,
  LocationController.getFixedAssets
);
router.post(
  "/",
  authMiddleware,
  workspaceMiddleware,
  checkSchema(LocationService.locationValidationSchema),
  LocationController.createLocation
);
router.patch(
  "/:locationId",
  authMiddleware,
  workspaceMiddleware,
  checkSchema(LocationService.locationValidationSchema),
  LocationController.updateLocation
);

router.delete(
  "/:locationId",
  authMiddleware,
  workspaceMiddleware,
  LocationController.deleteLocation
);

export default router;
