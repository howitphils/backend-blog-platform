import { SessionDbType } from "../../../../types/sessions-types";
import { SessionModel } from "./session-entity";
import { SessionDbDocumentType } from "./session-entity-types";

export class SessionRepository {
  async save(session: SessionDbDocumentType) {
    const result = await session.save();
    return await result.id;
  }

  async deleteAllSessions(userId: string, deviceId: string) {
    return SessionModel.deleteMany({
      userId,
      deviceId: { $ne: deviceId },
    });
  }

  async findByDeviceIdAndIssuedAt(iat: number, deviceId: string) {
    return SessionModel.findOne({ $and: [{ iat }, { deviceId }] });
  }

  async findByDeviceId(deviceId: string) {
    return SessionModel.findOne({ deviceId });
  }

  async findAllUsersSessions(userId: string): Promise<SessionDbType[]> {
    return SessionModel.find({ userId });
  }
}
