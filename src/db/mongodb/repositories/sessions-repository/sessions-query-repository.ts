import { WithId } from "mongodb";
import { sessionsCollection } from "../../mongodb";
import {
  SessionDbType,
  SessionViewModel,
} from "../../../../types/sessions-types";

export class SessionsQueryRepository {
  async getAllUsersSessions(userId: string): Promise<SessionViewModel[]> {
    const sessions = await sessionsCollection.find({ userId }).toArray();

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
