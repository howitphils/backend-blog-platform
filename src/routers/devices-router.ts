import { Router } from "express";

import { refreshTokenValidator } from "../middlewares/auth/cookie-auth-validator";
import { devicesController } from "./controllers/devices-controller";

export const devicesRouter = Router();

devicesRouter.get(
  "/devices",
  refreshTokenValidator,
  devicesController.getAllSessions
);
