import express from "express";
import { authControllers } from "./auth.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";

const router = express.Router();

router.post("/login", authControllers.loginController);
router.post("/refresh-token", authControllers.refreshTokenController);
router.post(
  "/change-password",
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.DOCTOR, UserRole.PATIENT),
  authControllers.changePasswordController
);

router.post("/forget-password", authControllers.forgetPasswordController);

router.post("/reset-password", authControllers.resetPasswordController);

export const authRoutes = router;
