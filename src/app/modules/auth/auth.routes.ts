import express from "express";
import { authControllers } from "./auth.controller";

const router = express.Router();

router.post("/login", authControllers.loginController);
router.post("/refresh-token", authControllers.refreshTokenController);

export const authRoutes = router;
