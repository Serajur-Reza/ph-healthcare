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

const changePasswordController = catchAsync(
  async (req: Request & { user?: any }, res: Response) => {
    const user = req.user;

    const result = await authServices.changePasswordService(user, req.body);
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "password changed successfully",
      data: result,
    });
  }
);

const forgetPasswordController = catchAsync(
  async (req: Request & { user?: any }, res: Response) => {
    const user = req.user;

    await authServices.forgetPasswordService(req.body);
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "reset password link sent. Please check your email",
      data: null,
    });
  }
);

const resetPasswordController = catchAsync(
  async (req: Request & { user?: any }, res: Response) => {
    const token = req.headers.authorization || "";

    await authServices.resetPasswordService(token, req.body);
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Password Reset!",
      data: null,
    });
  }
);

export const authControllers = {
  loginController,
  refreshTokenController,
  changePasswordController,
  forgetPasswordController,
  resetPasswordController,
};
