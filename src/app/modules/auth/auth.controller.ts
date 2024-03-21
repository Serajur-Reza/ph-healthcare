import { NextFunction, Request, Response } from "express";
import catchAsync from "../../../utils/catchAsync";
import { authServices } from "./auth.service";
import sendResponse from "../../../utils/sendResponse";

const loginController = catchAsync(async (req: Request, res: Response) => {
  const result = await authServices.loginService(req.body);

  const { accessToken, needPasswordChange, refreshToken } = result;

  res.cookie("refreshToken", refreshToken, {
    secure: false,
    httpOnly: true,
  });

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Logged in successfully",
    data: {
      accessToken,
      needPasswordChange,
    },
  });
});

const refreshTokenController = catchAsync(
  async (req: Request, res: Response) => {
    const { refreshToken } = req.cookies;
    console.log(refreshToken);
    const result = await authServices.refreshTokenService(refreshToken);
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Refresh token generated successfully",
      data: result,
    });
  }
);

export const authControllers = {
  loginController,
  refreshTokenController,
};
