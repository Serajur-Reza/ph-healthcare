import express, { NextFunction, Request, Response } from "express";
import { prisma } from "../../../app";
import { adminController } from "./admin.controller";
import { AnyZodObject, z } from "zod";
import validateRequest from "../../middlewares/validateRequest";
import { adminValidations } from "./admin.validations";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";

const router = express.Router();

router.get(
  "/",
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  adminController.getAllAdminsController
);
router.get(
  "/:id",
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  adminController.getSingleAdminController
);
router.patch(
  "/:id",
  validateRequest(adminValidations.updateAdmin),
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  adminController.updateAdminController
);
router.delete(
  "/:id",
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  adminController.deleteAdminController
);
router.delete(
  "/soft/:id",
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  adminController.softDeleteAdminController
);

export const adminRoutes = router;
