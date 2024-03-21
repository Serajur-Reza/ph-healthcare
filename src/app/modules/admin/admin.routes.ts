import express, { NextFunction, Request, Response } from "express";
import { prisma } from "../../../app";
import { adminController } from "./admin.controller";
import { AnyZodObject, z } from "zod";
import validateRequest from "../../middlewares/validateRequest";
import { adminValidations } from "./admin.validations";

const router = express.Router();

router.get("/", adminController.getAllAdminsController);
router.get("/:id", adminController.getSingleAdminController);
router.patch(
  "/:id",
  validateRequest(adminValidations.updateAdmin),
  adminController.updateAdminController
);
router.delete("/:id", adminController.deleteAdminController);
router.delete("/soft/:id", adminController.softDeleteAdminController);

export const adminRoutes = router;
