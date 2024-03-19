import express, { NextFunction, Request, Response } from "express";
import { prisma } from "../../../app";
import { adminService } from "./admin.service";
import pick from "../../../utils/pick";
import { adminFilterFields } from "./admin.constant";
import sendResponse from "../../../utils/sendResponse";
import httpStatus from "http-status";

const getAllAdminsController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
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
  } catch (error) {
    next(error);
  }
};

const getSingleAdminController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await adminService.getSingleAdminService(req.params.id);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "single admin found",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const updateAdminController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
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
  } catch (error) {
    next(error);
  }
};

const deleteAdminController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await adminService.deleteAdminService(req.params.id);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "admin deleted",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const softDeleteAdminController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await adminService.softDeleteAdminService(req.params.id);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "admin deleted",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const adminController = {
  getAllAdminsController,
  getSingleAdminController,
  updateAdminController,
  deleteAdminController,
  softDeleteAdminController,
};
