import { Request, Response } from "express";
import { userServices } from "./user.service";
import catchAsync from "../../../utils/catchAsync";
import pick from "../../../utils/pick";
import sendResponse from "../../../utils/sendResponse";
import httpStatus from "http-status";
import { userFilterableFields } from "./user.constant";

const getAllUsersController = catchAsync(
  async (req: Request, res: Response) => {
    const filters = pick(req.query, userFilterableFields);
    const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);

    console.log("options", options);
    const result = await userServices.getAllUsersService(filters, options);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "all users found",
      meta: result.meta,
      data: result.data,
    });
  }
);

const createAdminController = catchAsync(
  async (req: Request, res: Response) => {
    const result = await userServices.createAdminService(req);
    res.status(200).json({
      success: true,
      message: "Admin created successfully",
      data: result,
    });
  }
);

const createDoctorController = catchAsync(
  async (req: Request, res: Response) => {
    const result = await userServices.createDoctorService(req);
    res.status(200).json({
      success: true,
      message: "Doctor created successfully",
      data: result,
    });
  }
);

const changeProfileStatusController = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await userServices.changeProfileStatusService(id, req.body);
    res.status(200).json({
      success: true,
      message: "Status changed successfully",
      data: result,
    });
  }
);

const createPatientController = catchAsync(
  async (req: Request, res: Response) => {
    const result = await userServices.createPatientService(req);
    res.status(200).json({
      success: true,
      message: "Patient created successfully",
      data: result,
    });
  }
);

export const userControllers = {
  getAllUsersController,
  createAdminController,
  createDoctorController,
  createPatientController,
  changeProfileStatusController,
};
