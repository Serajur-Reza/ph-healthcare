import { Request, Response } from "express";
import { userServices } from "./user.service";

const createAdminController = async (req: Request, res: Response) => {
  console.log(req.body);
  const result = await userServices.createAdminService(req.body);
  res.send(result);
};

export const userControllers = {
  createAdminController,
};
