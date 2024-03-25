import { Gender, UserStatus } from "@prisma/client";
import { z } from "zod";

const createAdminValidation = z.object({
  password: z.string({
    required_error: "Password is required",
  }),
  admin: z.object({
    name: z.string({
      required_error: "name is required",
    }),
    email: z.string({
      required_error: "email is required",
    }),
    contactNumber: z.string({
      required_error: "contactNumber is required",
    }),
  }),
});

const createDoctorValidation = z.object({
  password: z.string({
    required_error: "Password is required",
  }),
  doctor: z.object({
    name: z.string({
      required_error: "name is required",
    }),
    email: z.string({
      required_error: "email is required",
    }),
    contactNumber: z.string({
      required_error: "contactNumber is required",
    }),

    address: z.string().optional(),
    registrationNumber: z.string({
      required_error: "registrationNumber is required",
    }),
    experience: z.number().optional(),

    gender: z.enum([Gender.FEMALE, Gender.MALE]),
    appointmentFee: z.number({
      required_error: "appointmentFee is required",
    }),
    qualification: z.string({
      required_error: "qualification is required",
    }),

    currentWorkingPlace: z.string({
      required_error: "currentWorkingPlace is required",
    }),
    designation: z.string({
      required_error: "designation is required",
    }),
    // isDeleted: z.boolean(),
  }),
});

const createPatientValidation = z.object({
  password: z.string({
    required_error: "Password is required",
  }),
  patient: z.object({
    name: z.string({
      required_error: "name is required",
    }),
    email: z.string({
      required_error: "email is required",
    }),
    contactNumber: z.string({
      required_error: "contactNumber is required",
    }),

    address: z.string().optional(),
    gender: z.enum([Gender.FEMALE, Gender.MALE]),
    // isDeleted: z.boolean(),
  }),
});

const statusChangeValidation = z.object({
  body: z.object({
    status: z.enum([UserStatus.ACTIVE, UserStatus.BLOCKED, UserStatus.DELETED]),
  }),
});

export const userValidation = {
  createAdminValidation,
  createDoctorValidation,
  createPatientValidation,
  statusChangeValidation,
};
