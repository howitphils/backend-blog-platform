import { SessionDbType } from "../../../../types/sessions-types";
import { sessionsCollection } from "../../mongodb";

export const sessionRepository = {
  async createSession(session: SessionDbType) {
    const insertedId = await sessionsCollection.insertOne(session);
    return insertedId;
  },

  async deleteSession(userId: string, deviceId: string) {
    const deleteResult = await sessionsCollection.deleteOne({
      $and: [{ userId }, { deviceId }],
    });
    return deleteResult.deletedCount === 1;
  },

  async findByUserIdAndDeviceId(userId: string, deviceId: string) {
    return sessionsCollection.findOne({ $and: [{ userId }, { deviceId }] });
  },

  async updateSessionIatAndExp(
    userId: string,
    deviceId: string,
    newIat: number | undefined,
    newExp: number | undefined
  ) {
    // TODO: fix types
    const updateResult = await sessionsCollection.updateOne(
      { $and: [{ userId }, { deviceId }] },
      { $set: { iat: newIat, exp: newExp } }
    );

    return updateResult.matchedCount === 1;
  },

  async findAllUsersSession(userId: string) {},
};
