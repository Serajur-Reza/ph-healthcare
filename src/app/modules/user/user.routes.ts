import express, { NextFunction, Request, Response } from "express";
import { userControllers } from "./user.controller";
import { verifyToken } from "../../../utils/jwtHelpers";
import config from "../../../config";
import { Secret } from "jsonwebtoken";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";

const router = express.Router();

router.post(
  "/",
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  userControllers.createAdminController
);

export const userRoutes = router;
