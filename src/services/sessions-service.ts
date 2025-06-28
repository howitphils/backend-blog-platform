import { inject, injectable } from "inversify";
import { SessionRepository } from "../db/mongodb/repositories/sessions-repository/session-repository";
import { ErrorWithStatusCode } from "../middlewares/error-handler";
import { HttpStatuses } from "../types/http-statuses";
import { SessionDbType } from "../types/sessions-types";

@injectable()
export class SessionService {
  constructor(
    @inject(SessionRepository) private sessionsRepository: SessionRepository
  ) {}

  async getAllUsersSessions(userId: string): Promise<SessionDbType[]> {
    return this.sessionsRepository.findAllUsersSessions(userId);
  }

  async deleteAllSessions(userId: string, deviceId: string): Promise<void> {
    await this.sessionsRepository.deleteAllSessions(userId, deviceId);
    const count = await this.sessionsRepository.findAllUsersSessions(userId);

    if (count.length !== 1) {
      throw new ErrorWithStatusCode(
        "Session collection for this user was not cleared properly",
        HttpStatuses.ServerError
      );
    }
  }

  async deleteSession(userId: string, deviceId: string): Promise<void> {
    const targetSession = await this.sessionsRepository.findByDeviceId(
      deviceId
    );

    if (!targetSession) {
      throw new ErrorWithStatusCode(
        "Session is not found",
        HttpStatuses.NotFound
      );
    }

    if (targetSession.userId !== userId) {
      throw new ErrorWithStatusCode("Forbidden action", HttpStatuses.Forbidden);
    }

    this.sessionsRepository.deleteSession(userId, deviceId);
  }
}
