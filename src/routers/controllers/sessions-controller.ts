import { Request, Response } from "express";
import { HttpStatuses } from "../../types/http-statuses";
import { RequestWithParams } from "../../types/requests-types";
import { ErrorWithStatusCode } from "../../middlewares/error-handler";
import { SessionsQueryRepository } from "../../db/mongodb/repositories/sessions-repository/sessions-query-repository";
import { SessionService } from "../../services/sessions-service";
import { inject, injectable } from "inversify";

@injectable()
export class SessionsController {
  constructor(
    @inject(SessionsQueryRepository)
    private sessionsQueryRepository: SessionsQueryRepository,

    @inject(SessionService)
    private sessionsService: SessionService
  ) {}

  async getAllSessions(req: Request, res: Response) {
    const userId = req.user.id;

    const sessions = await this.sessionsQueryRepository.getAllUsersSessions(
      userId
    );

    res.status(HttpStatuses.Success).json(sessions);
  }

  async deleteAllSessions(req: Request, res: Response) {
    const userId = req.user.id;
    const deviceId = req.user.deviceId;
    if (!deviceId) {
      throw new Error("deviceId is not found in req.user");
    }

    await this.sessionsService.deleteAllSessions(userId, deviceId);

    res.sendStatus(HttpStatuses.NoContent);
  }

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

    await this.sessionsService.deleteSession(userId, deviceId);

    res.sendStatus(HttpStatuses.NoContent);
  }
}
