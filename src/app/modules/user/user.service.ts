import { Doctor, Patient, Prisma, UserRole, UserStatus } from "@prisma/client";
import { prisma } from "../../../app";
import * as bcrypt from "bcrypt";
import { fileUploader } from "../../../utils/fileUploader";
import { TFile } from "../../types/file";
import { userSearchableFields } from "./user.constant";
import { calculatePagination } from "../../../utils/pagination";
import { TPaginationOptions } from "../../types/pagination";

const getAllUsersService = async (params: any, options: TPaginationOptions) => {
  const { searchTerm, ...filterData } = params;

  const { limit, page, skip } = calculatePagination(options);
  const conditions: Prisma.UserWhereInput[] = [];

  if (params.searchTerm) {
    conditions.push({
      OR: userSearchableFields.map((field) => ({
        [field]: {
          contains: params.searchTerm,
          mode: "insensitive",
        },
      })),
    });
  }

  if (Object.keys(filterData).length > 0) {
    conditions.push({
      AND: Object.keys(filterData).map((key) => ({
        [key]: {
          equals: (filterData as any)[key],
        },
      })),
    });
  }

  const andCondition: Prisma.UserWhereInput = conditions.length
    ? {
        AND: conditions,
      }
    : {};
  const result = await prisma.user.findMany({
    where: andCondition,
    skip,
    take: limit,
    orderBy:
      options.sortBy && options.sortOrder
        ? {
            [options.sortBy]: options.sortOrder,
          }
        : { createdAt: "desc" },
    select: {
      id: true,
      email: true,
      role: true,
      needsPassword: true,
      createdAt: true,
      updatedAt: true,

      //   admin: true,
      //   patient: true,
      //   doctor: true,
    },
    // include: {
    //   admin: true,
    //   patient: true,
    //   doctor: true,
    // },
  });

  const total = await prisma.user.count({
    where: andCondition,
  });
  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

const createAdminService = async (req: any) => {
  const file: TFile = req.file;
  console.log(req.body);
  if (file) {
    const uploadToCloudinary = await fileUploader.uploadToCloudinary(file);
    console.log("from service:", uploadToCloudinary);
    req.body.admin.profilePhoto = uploadToCloudinary?.secure_url as string;

    console.log(req.body);
  }

  const hashedPassword = await bcrypt.hash(req.body.password, 12);

  const userData = {
    email: req.body.admin.email,
    password: hashedPassword,
    role: UserRole.ADMIN,
  };

  const result = await prisma.$transaction(async (transactionClient) => {
    const createdUserData = await transactionClient.user.create({
      data: userData,
    });

    const createAdminData = await transactionClient.admin.create({
      data: req.body.admin,
    });

    return createAdminData;
  });
  return result;
};

const createDoctorService = async (req: any): Promise<Doctor> => {
  const file: TFile = req.file;
  console.log(req.body);
  if (file) {
    const uploadToCloudinary = await fileUploader.uploadToCloudinary(file);
    console.log("from service:", uploadToCloudinary);
    req.body.doctor.profilePhoto = uploadToCloudinary?.secure_url as string;

    console.log(req.body);
  }

  const hashedPassword = await bcrypt.hash(req.body.password, 12);

  const userData = {
    email: req.body.doctor.email,
    password: hashedPassword,
    role: UserRole.DOCTOR,
  };

  console.log("userData", userData);

  const result = await prisma.$transaction(async (transactionClient) => {
    const createdUserData = await transactionClient.user.create({
      data: userData,
    });

    const createDoctorData = await transactionClient.doctor.create({
      data: req.body.doctor,
    });

    return createDoctorData;
  });
  return result;
};

const changeProfileStatusService = async (id: string, status: UserRole) => {
  console.log(id, status);
  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      id,
    },
  });

  const updateUserStatus = await prisma.user.update({
    where: {
      id,
    },
    data: status,
  });

  return updateUserStatus;
};

const createPatientService = async (req: any): Promise<Patient> => {
  const file: TFile = req.file;
  console.log(req.body);
  if (file) {
    const uploadToCloudinary = await fileUploader.uploadToCloudinary(file);
    console.log("from service:", uploadToCloudinary);
    req.body.patient.profilePhoto = uploadToCloudinary?.secure_url as string;

    console.log(req.body);
  }

  const hashedPassword = await bcrypt.hash(req.body.password, 12);

  const userData = {
    email: req.body.patient.email,
    password: hashedPassword,
    role: UserRole.PATIENT,
  };

  const result = await prisma.$transaction(async (transactionClient) => {
    const createdUserData = await transactionClient.user.create({
      data: userData,
    });

    const createPatientData = await transactionClient.patient.create({
      data: req.body.patient,
    });

    return createPatientData;
  });
  return result;
};

export const userServices = {
  getAllUsersService,
  createAdminService,
  createDoctorService,
  createPatientService,
  changeProfileStatusService,
};
