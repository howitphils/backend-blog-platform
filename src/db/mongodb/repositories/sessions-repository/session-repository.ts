import { SessionDbType } from "../../../../types/sessions-types";
import { SessionsModel } from "./session-entity";

export class SessionRepository {
  async createSession(session: SessionDbType) {
    const insertedId = await SessionsModel.insertOne(session);
    return insertedId;
  }

  async deleteSession(userId: string, deviceId: string) {
    const deleteResult = await SessionsModel.deleteOne({
      $and: [{ userId }, { deviceId }],
    });
    return deleteResult.deletedCount === 1;
  }

  async deleteAllSessions(userId: string, deviceId: string) {
    return SessionsModel.deleteMany({
      userId,
      deviceId: { $ne: deviceId },
    });
  }

  async findByDeviceIdAndIssuedAt(iat: number, deviceId: string) {
    return SessionsModel.findOne({ $and: [{ iat }, { deviceId }] });
  }

  async findByDeviceId(deviceId: string) {
    return SessionsModel.findOne({ deviceId });
  }

  async updateSessionIatAndExp(
    userId: string,
    deviceId: string,
    newIat: number,
    newExp: number
  ) {
    // TODO: fix types
    const updateResult = await SessionsModel.updateOne(
      { $and: [{ userId }, { deviceId }] },
      { $set: { iat: newIat, exp: newExp } }
    );

    return updateResult.matchedCount === 1;
  }

  async findAllUsersSessions(userId: string): Promise<SessionDbType[]> {
    return SessionsModel.find({ userId });
  }
}
