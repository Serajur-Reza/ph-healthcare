import express, { Request, Response } from "express";
import { prisma } from "../../../app";
import { adminController } from "./admin.controller";

const router = express.Router();

router.get("/", adminController.getAllAdminsController);
router.get("/:id", adminController.getSingleAdminController);
router.patch("/:id", adminController.updateAdminController);
router.delete("/:id", adminController.deleteAdminController);
router.delete("/soft/:id", adminController.softDeleteAdminController);

export const adminRoutes = router;
