import { Request, Response } from "express";
import { sessionsService } from "../../services/sessions-service";
import { HttpStatuses } from "../../types/http-statuses";
import { RequestWithParams } from "../../types/requests-types";
import { sessionsQueryRepository } from "../../db/mongodb/repositories/sessions-repository/sessions-query-repository";
import { ErrorWithStatusCode } from "../../middlewares/error-handler";

export const sessionsController = {
  async getAllSessions(req: Request, res: Response) {
    const userId = req.user.id;

    const sessions = await sessionsQueryRepository.getAllUsersSessions(userId);

    res.status(HttpStatuses.Success).json(sessions);
  },

  async deleteAllSessions(req: Request, res: Response) {
    const userId = req.user.id;
    const deviceId = req.user.deviceId;
    if (!deviceId) {
      throw new Error("deviceId is not found in req.user");
    }

    await sessionsService.deleteAllSessions(userId, deviceId);

    res.sendStatus(HttpStatuses.NoContent);
  },

  async deleteSession(
    req: RequestWithParams<{ deviceId: string }>,
    res: Response
  ) {
    const userId = req.user.id;
    const deviceId = req.params.deviceId;

    if (!deviceId) {
      throw new ErrorWithStatusCode(
        "deviceId is not found",
        HttpStatuses.NotFound
      );
    }

    await sessionsService.deleteSession(userId, deviceId);

    res.sendStatus(HttpStatuses.NoContent);
  },
};
