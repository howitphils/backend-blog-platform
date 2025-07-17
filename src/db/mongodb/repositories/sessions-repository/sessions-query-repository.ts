import { WithId } from "mongodb";
import {
  SessionDbType,
  SessionViewModel,
} from "../../../../types/sessions-types";
import { SessionModel } from "./session-entity";

export class SessionsQueryRepository {
  async getAllUsersSessions(userId: string): Promise<SessionViewModel[]> {
    const sessions = await SessionModel.find({ userId });

    return sessions.map(this._mapFromDbToViewModel);
  }

  // Преобразование сессии из формата базы данных в формат, который ожидает клиент
  _mapFromDbToViewModel(session: WithId<SessionDbType>): SessionViewModel {
    return {
      deviceId: session.deviceId,
      ip: session.ip,
      lastActiveDate: new Date(session.iat).toISOString(),
      title: session.device_name,
    };
  }
}
