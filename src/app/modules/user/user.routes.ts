import express, { NextFunction, Request, Response } from "express";
import { userControllers } from "./user.controller";

import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
import { fileUploader } from "./../../../utils/fileUploader";
import validateRequest from "../../middlewares/validateRequest";
import { userValidation } from "./user.validation";

const router = express.Router();

router.get(
  "/",
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  userControllers.getAllUsersController
);

router.post(
  "/create-admin",
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  fileUploader.upload.single("file"),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = userValidation.createAdminValidation.parse(
      JSON.parse(req.body.data)
    );
    return userControllers.createAdminController(req, res, next);
  }
);

router.post(
  "/create-doctor",
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  fileUploader.upload.single("file"),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = userValidation.createDoctorValidation.parse(
      JSON.parse(req.body.data)
    );
    return userControllers.createDoctorController(req, res, next);
  }
);

router.post(
  "/create-patient",
  fileUploader.upload.single("file"),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = userValidation.createPatientValidation.parse(
      JSON.parse(req.body.data)
    );
    return userControllers.createPatientController(req, res, next);
  }
);

router.patch(
  "/:id/status",
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  validateRequest(userValidation.statusChangeValidation),
  userControllers.changeProfileStatusController
);

export const userRoutes = router;
