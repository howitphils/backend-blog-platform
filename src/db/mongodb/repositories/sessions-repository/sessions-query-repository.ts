import { WithId } from "mongodb";
import { sessionsCollection } from "../../mongodb";
import {
  SessionDbType,
  SessionViewModel,
} from "../../../../types/sessions-types";

export const sessionsQueryRepository = {
  async getAllUsersSessions(userId: string): Promise<SessionViewModel[]> {
    const sessions = await sessionsCollection.find({ userId }).toArray();

    return sessions.map(this._mapFromDbToViewModel);
  },

  // Преобразование поста из формата базы данных в формат, который ожидает клиент
  _mapFromDbToViewModel(session: WithId<SessionDbType>): SessionViewModel {
    return {
      deviceId: session.deviceId,
      ip: session.ip,
      lastActiveDate: session.iat.toString(),
      title: session.device_name,
    };
  },
};
