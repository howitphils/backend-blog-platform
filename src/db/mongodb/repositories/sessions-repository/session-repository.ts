import { SessionDbType } from "../../../../types/sessions-types";
import { SessionModel } from "./session-entity";

export class SessionRepository {
  async createSession(session: SessionDbType) {
    const insertedId = await SessionModel.insertOne(session);
    return insertedId;
  }

  async deleteSession(userId: string, deviceId: string) {
    const deleteResult = await SessionModel.deleteOne({
      $and: [{ userId }, { deviceId }],
    });
    return deleteResult.deletedCount === 1;
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

  async updateSessionIatAndExp(
    userId: string,
    deviceId: string,
    newIat: number,
    newExp: number
  ) {
    // TODO: fix types
    const updateResult = await SessionModel.updateOne(
      { $and: [{ userId }, { deviceId }] },
      { $set: { iat: newIat, exp: newExp } }
    );

    return updateResult.matchedCount === 1;
  }

  async findAllUsersSessions(userId: string): Promise<SessionDbType[]> {
    return SessionModel.find({ userId });
  }
}
