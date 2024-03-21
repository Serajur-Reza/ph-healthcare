import express, { NextFunction, Request, Response } from "express";
import { adminService } from "./admin.service";
import pick from "../../../utils/pick";
import { adminFilterFields } from "./admin.constant";
import sendResponse from "../../../utils/sendResponse";
import httpStatus from "http-status";
import catchAsync from "../../../utils/catchAsync";

const getAllAdminsController = catchAsync(
  async (req: Request, res: Response) => {
    const filters = pick(req.query, adminFilterFields);
    const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);

    console.log("options", options);
    const result = await adminService.getAllAdminsService(filters, options);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "all admins found",
      meta: result.meta,
      data: result.data,
    });
  }
);

const getSingleAdminController = catchAsync(
  async (req: Request, res: Response) => {
    const result = await adminService.getSingleAdminService(req.params.id);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "single admin found",
      data: result,
    });
  }
);

const updateAdminController = catchAsync(
  async (req: Request, res: Response) => {
    const result = await adminService.updateAdminService(
      req.params.id,
      req.body
    );
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "admin updated",
      data: result,
    });
  }
);

const deleteAdminController = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await adminService.deleteAdminService(req.params.id);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "admin deleted",
      data: result,
    });
  }
);

const softDeleteAdminController = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await adminService.softDeleteAdminService(req.params.id);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "admin deleted",
      data: result,
    });
  }
);

export const adminController = {
  getAllAdminsController,
  getSingleAdminController,
  updateAdminController,
  deleteAdminController,
  softDeleteAdminController,
};
