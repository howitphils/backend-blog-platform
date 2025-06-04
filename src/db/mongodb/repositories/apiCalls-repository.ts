import { apiCallsCollection } from "../mongodb";

export const apiCallsRepository = {
  async getAllCallsCount({
    ip,
    url,
    date,
  }: {
    ip: string;
    url: string;
    date: Date;
  }) {
    return apiCallsCollection.countDocuments({ ip, url, date: { $gte: date } });
  },

  async insertCall({ ip, url, date }: { ip: string; url: string; date: Date }) {
    return apiCallsCollection.insertOne({ date, ip, url });
  },
};
