import { sessionsRepository } from "../db/mongodb/repositories/sessions-repository/session-repository";
import { ErrorWithStatusCode } from "../middlewares/error-handler";
import { HttpStatuses } from "../types/http-statuses";
import { SessionDbType } from "../types/sessions-types";

export const devicesService = {
  async getAllUsersSessions(userId: string): Promise<SessionDbType[]> {
    return sessionsRepository.findAllUsersSessions(userId);
  },

  async deleteAllSessions(userId: string, deviceId: string): Promise<void> {
    await sessionsRepository.deleteAllSessions(userId, deviceId);
    const count = await sessionsRepository.findAllUsersSessions(userId);

    if (count.length !== 1) {
      throw new ErrorWithStatusCode(
        "Session collection for this user was not cleared properly",
        HttpStatuses.ServerError
      );
    }
  },

  async deleteSession(userId: string, deviceId: string): Promise<void> {
    const targetSession = await sessionsRepository.findByUserIdAndDeviceId(
      userId,
      deviceId
    );

    if (!targetSession) {
      throw new ErrorWithStatusCode(
        "Session is not found",
        HttpStatuses.NotFound
      );
    }

    sessionsRepository.deleteSession(userId, deviceId);
  },
};
