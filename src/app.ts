import express, { Application, Request, Response } from "express";
import cors from "cors";
import { userRoutes } from "./app/modules/user/user.routes";
import { PrismaClient } from "@prisma/client";

const app: Application = express();
export const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1/user", userRoutes);

app.get("/", (req: Request, res: Response) => {
  res.send({
    status: 200,
    message: "App is running",
  });
});

export default app;
