import express from "express";
import { checkSchema } from "express-validator";

import AuthService from "../services/AuthService";
import AuthController from "../controllers/AuthController";
import authMiddleware from "../middlewares/authMiddleware";

const router = express.Router();
router.post("/login", checkSchema(AuthService.loginValidationSchema), AuthController.login);
router.get("/profile", authMiddleware, AuthController.profile);
router.patch(
  "/profile",
  authMiddleware,
  checkSchema(AuthService.updateValidationSchema),
  AuthController.updateProfile
);
router.delete("/profile", authMiddleware, AuthController.deleteProfile);
router.post("/signup", checkSchema(AuthService.signupValidationSchema), AuthController.signup);
router.post(
  "/reset-password",
  checkSchema(AuthService.resetPasswordValidationSchema),
  AuthController.resetPassword
);
router.post(
  "/new-password",
  checkSchema(AuthService.newPasswordValidationSchema),
  AuthController.newPassword
);
router.post("/verify-email", authMiddleware, AuthController.verifyEmail);
router.post(
  "/verified-email",
  checkSchema(AuthService.verifiedEmailValidationSchema),
  AuthController.verifiedEmail
);

export default router;
