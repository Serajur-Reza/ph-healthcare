import express, { Application, NextFunction, Request, Response } from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";
import router from "./app/routes";
import globalErrorHandler from "./app/middlewares/globalErrorHandler";
import httpStatus from "http-status";
import cookieParser from "cookie-parser";

const app: Application = express();
export const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// app.use("/api/v1/user", userRoutes);
// app.use("/api/v1/admin", adminRoutes);

app.get("/", (req: Request, res: Response) => {
  res.send({
    status: 200,
    message: "App is running",
  });
});

app.use("/api/v1", router);

app.use(globalErrorHandler);

app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(httpStatus.NOT_FOUND).json({
    success: false,
    message: "API does not exist",
    error: {
      path: req.originalUrl,
      message: `Your requested path is not found`,
    },
  });
});

export default app;
