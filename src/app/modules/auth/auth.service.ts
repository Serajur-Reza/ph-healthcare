import { prisma } from "../../../app";
import * as bcrypt from "bcrypt";
import { generateToken, verifyToken } from "../../../utils/jwtHelpers";
import jwt, { JwtPayload } from "jsonwebtoken";
import { UserStatus } from "@prisma/client";

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
    "abcdefg",
    "5m"
  );
  const refreshToken = generateToken(
    {
      email: userData?.email,
      role: userData?.role,
    },
    "abcdefgh",
    "30d"
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
    decodedData = verifyToken(refreshToken, "abcdefgh");
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
    "abcdefg",
    "5m"
  );

  return {
    accessToken,
    refreshToken,
    needPasswordChange: userData.needsPassword,
  };
};

export const authServices = { loginService, refreshTokenService };
