import { SessionDbType } from "../../../../types/sessions-types";
import { sessionsCollection } from "../../mongodb";

export const sessionRepository = {
  async createSession(session: SessionDbType) {
    const insertedId = await sessionsCollection.insertOne(session);
    return insertedId;
  },
};
