import { Request, Response } from "express";
import { devicesService } from "../../services/devices-service";

export const devicesController = {
  async getAllSessions(req: Request, res: Response) {
    const userId = req.user?.id;
    if (!userId) {
      res.sendStatus(500);
      console.log("no user found in request");
      return;
    }

    const sessions = await devicesService.getAllUsersSessions(userId);

    res.status(200).json(sessions);
  },
};
