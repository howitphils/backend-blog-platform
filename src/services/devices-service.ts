import { sessionRepository } from "../db/mongodb/repositories/sessions-repository/session-repository";

export const devicesService = {
  async getAllUsersSessions(userId: string) {
    return sessionRepository.findAllUsersSessions(userId);
  },
};
