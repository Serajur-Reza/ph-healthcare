import { prisma } from "../../../app";
import * as bcrypt from "bcrypt";
import { generateToken, verifyToken } from "../../../utils/jwtHelpers";
import jwt, { JwtPayload, Secret } from "jsonwebtoken";
import { UserStatus } from "@prisma/client";
import config from "../../../config";
import ApiError from "../../errors/ApiError";
import emailSender from "../../../utils/emailSender";
import httpStatus from "http-status";

const loginService = async (payload: { email: string; password: string }) => {
  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      email: payload.email,
      status: UserStatus.ACTIVE,
    },
  });

  const isCorrectPassword = await bcrypt.compare(
    payload.password,
    userData.password
  );

  if (!isCorrectPassword) {
    throw new Error("Incorrect Password");
  }

  const accessToken = generateToken(
    {
      email: userData?.email,
      role: userData?.role,
    },
    config.jwt.jwt_secret as Secret,
    config.jwt.jwt_expires_in as string
  );
  const refreshToken = generateToken(
    {
      email: userData?.email,
      role: userData?.role,
    },
    config.jwt.refresh_token_secret as Secret,
    config.jwt.refresh_token_expires_in as string
  );

  return {
    accessToken,
    refreshToken,
    needPasswordChange: userData.needsPassword,
  };
};

const refreshTokenService = async (refreshToken: string) => {
  let decodedData;
  try {
    decodedData = verifyToken(
      refreshToken,
      config.jwt.refresh_token_secret as Secret
    );
    console.log(decodedData);
  } catch (error) {
    throw new Error("You are not authorized");
  }

  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      email: decodedData.email,
      status: UserStatus.ACTIVE,
    },
  });

  const accessToken = generateToken(
    {
      email: userData?.email,
      role: userData?.role,
    },
    config.jwt.jwt_secret as Secret,
    config.jwt.jwt_expires_in as string
  );

  return {
    accessToken,
    needPasswordChange: userData.needsPassword,
  };
};

const changePasswordService = async (
  user: JwtPayload,
  payload: { oldPassword: string; newPassword: string }
) => {
  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      email: user.email,
      status: UserStatus.ACTIVE,
    },
  });

  const isCorrectPassword = await bcrypt.compare(
    payload.oldPassword,
    userData.password
  );

  if (!isCorrectPassword) {
    throw new Error("Incorrect Password");
  }

  const hashedPassword = await bcrypt.hash(payload.newPassword, 12);

  await prisma.user.update({
    where: {
      email: user.email,
    },
    data: {
      password: hashedPassword,
      needsPassword: false,
    },
  });

  return {
    message: "password changed successfully",
  };
};

const forgetPasswordService = async (payload: { email: string }) => {
  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      email: payload.email,
      status: UserStatus.ACTIVE,
    },
  });

  const resetPasswordToken = generateToken(
    {
      email: userData.email,
      role: userData.role,
    },
    config.jwt.reset_password_secret as Secret,
    config.jwt.reset_password_token_expires_in as string
  );

  console.log(resetPasswordToken);

  const resetPasswordLink = `${config.reset_password_link}?userId=${userData.id}&token=${resetPasswordToken}`;
  await emailSender(
    userData.email,
    `<div>
    <p>Dear User,</p>
    <p>Your password reset link</p>
    <a href=${resetPasswordLink}>${resetPasswordLink}</a>
    </div>`
  );
  console.log(resetPasswordLink);
};

const resetPasswordService = async (
  token: string,
  payload: { id: string; password: string }
) => {
  console.log(token, payload);

  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      id: payload.id,
      status: UserStatus.ACTIVE,
    },
  });

  console.log("fdjklfeao");

  const isValidToken = verifyToken(
    token,
    config.jwt.reset_password_secret as Secret
  );

  console.log(isValidToken);

  if (!isValidToken) {
    throw new ApiError(httpStatus.FORBIDDEN, "Forbidden!");
  }

  //hashpassword

  const hashedPassword = await bcrypt.hash(payload.password, 12);
  //update into database

  const updatedUser = await prisma.user.update({
    where: {
      id: userData.id,
    },
    data: {
      password: hashedPassword,
    },
  });

  return updatedUser;
};

export const authServices = {
  loginService,
  refreshTokenService,
  changePasswordService,
  forgetPasswordService,
  resetPasswordService,
};
