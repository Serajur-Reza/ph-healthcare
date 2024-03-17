import express, { Request, Response } from "express";
import { prisma } from "../../../app";
import { adminService } from "./admin.service";
import pick from "../../../utils/pick";
import { adminFilterFields } from "./admin.constant";

const getAllAdminsController = async (req: Request, res: Response) => {
  try {
    const filters = pick(req.query, adminFilterFields);
    const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);

    console.log("options", options);
    const result = await adminService.getAllAdminsService(filters, options);
    res.status(200).json({
      status: true,
      message: "all admins found",
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error?.name || "something went wrong",
      error,
    });
  }
};

export const adminController = {
  getAllAdminsController,
};
