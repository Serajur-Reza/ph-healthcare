import { UserRole } from "@prisma/client";
import { prisma } from "../../../app";
import * as bcrypt from "bcrypt";

const createAdminService = async (data: any) => {
  const hashedPassword = await bcrypt.hash(data.password, 12);

  const userData = {
    email: data.admin.email,
    password: hashedPassword,
    role: UserRole.ADMIN,
  };

  const result = await prisma.$transaction(async (transactionClient) => {
    const createdUserData = await transactionClient.user.create({
      data: userData,
    });

    const createAdminData = await transactionClient.admin.create({
      data: data.admin,
    });

    return createAdminData;
  });
  return result;
};

export const userServices = {
  createAdminService,
};
