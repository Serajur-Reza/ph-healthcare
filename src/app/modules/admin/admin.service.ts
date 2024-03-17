import { Prisma } from ".prisma/client";
import { prisma } from "../../../app";
import { adminSearchableFields } from "./admin.constant";
import { calculatePagination } from "../../../utils/pagination";

const getAllAdminsService = async (params: any, options: any) => {
  const { searchTerm, ...filterData } = params;

  const { limit, page, skip } = calculatePagination(options);
  const conditions: Prisma.AdminWhereInput[] = [];

  //   [
  //         {
  //           name: {
  //             contains: params.searchTerm,
  //             mode: "insensitive",
  //           },
  //         },
  //         {
  //           email: {
  //             contains: params.searchTerm,
  //             mode: "insensitive",
  //           },
  //         },
  //       ],

  if (params.searchTerm) {
    conditions.push({
      OR: adminSearchableFields.map((field) => ({
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
          equals: filterData[key],
        },
      })),
    });
  }

  const andCondition: Prisma.AdminWhereInput = {
    AND: conditions,
  };
  const result = await prisma.admin.findMany({
    where: andCondition,
    skip,
    take: limit,
    orderBy:
      options.sortBy && options.sortOrder
        ? {
            [options.sortBy]: options.sortOrder,
          }
        : { createdAt: "desc" },
  });
  return result;
};

export const adminService = {
  getAllAdminsService,
};
