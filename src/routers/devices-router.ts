import { Router } from "express";

import { refreshTokenValidator } from "../middlewares/auth/cookie-auth-validator";
import { devicesController } from "./controllers/devices-controller";

export const devicesRouter = Router();

devicesRouter.get(
  "/devices",
  refreshTokenValidator,
  devicesController.getAllSessions
);

devicesRouter.delete(
  "/devices/:deviceId",
  refreshTokenValidator,
  devicesController.getAllSessions
);

devicesRouter.get(
  "/devices",
  refreshTokenValidator,
  devicesController.getAllSessions
);
