import { SessionDbType } from "../../../../types/sessions-types";
import { sessionsCollection } from "../../mongodb";

class SessionRepository {
  async createSession(session: SessionDbType) {
    const insertedId = await sessionsCollection.insertOne(session);
    return insertedId;
  }

  async deleteSession(userId: string, deviceId: string) {
    const deleteResult = await sessionsCollection.deleteOne({
      $and: [{ userId }, { deviceId }],
    });
    return deleteResult.deletedCount === 1;
  }

  async deleteAllSessions(userId: string, deviceId: string) {
    return sessionsCollection.deleteMany({
      userId,
      deviceId: { $ne: deviceId },
    });
  }

  async findByDeviceIdAndIssuedAt(iat: number, deviceId: string) {
    return sessionsCollection.findOne({ $and: [{ iat }, { deviceId }] });
  }

  async findByDeviceId(deviceId: string) {
    return sessionsCollection.findOne({ deviceId });
  }

  async updateSessionIatAndExp(
    userId: string,
    deviceId: string,
    newIat: number,
    newExp: number
  ) {
    // TODO: fix types
    const updateResult = await sessionsCollection.updateOne(
      { $and: [{ userId }, { deviceId }] },
      { $set: { iat: newIat, exp: newExp } }
    );

    return updateResult.matchedCount === 1;
  }

  async findAllUsersSessions(userId: string): Promise<SessionDbType[]> {
    return sessionsCollection.find({ userId }).toArray();
  }
}

export const sessionsRepository = new SessionRepository();
