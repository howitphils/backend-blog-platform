import { Request, Response } from "express";
import { devicesService } from "../../services/devices-service";
import { HttpStatuses } from "../../types/http-statuses";
import { RequestWithParams } from "../../types/requests-types";

export const devicesController = {
  async getAllSessions(req: Request, res: Response) {
    const userId = req.user.id;

    //TODO: сделать в квери репо с маппингом
    const sessions = await devicesService.getAllUsersSessions(userId);

    res.status(HttpStatuses.Success).json(sessions);
  },

  async deleteAllSessions(req: Request, res: Response) {
    const userId = req.user.id;
    const deviceId = req.user.deviceId;
    if (!deviceId) {
      throw new Error("deviceId is not found in req.user");
    }

    await devicesService.deleteAllSessions(userId, deviceId);

    res.sendStatus(HttpStatuses.NoContent);
  },

  async deleteSession(
    req: RequestWithParams<{ deviceId: string }>,
    res: Response
  ) {
    const userId = req.user.id;
    const deviceId = req.params.deviceId;

    await devicesService.deleteSession(userId, deviceId);

    res.sendStatus(HttpStatuses.NoContent);
  },
};
