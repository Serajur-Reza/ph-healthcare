import express, { Request, Response } from "express";
import { prisma } from "../../../app";
import { adminController } from "./admin.controller";

const router = express.Router();

router.get("/", adminController.getAllAdminsController);

export const adminRoutes = router;
