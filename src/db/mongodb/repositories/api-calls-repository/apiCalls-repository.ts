import { ApiCallsModel } from "./api-call-entity";

export class ApiCallsRepository {
  async getAllCallsCount({
    ip,
    url,
    date,
  }: {
    ip: string;
    url: string;
    date: Date;
  }) {
    return ApiCallsModel.countDocuments({ ip, url, date: { $gte: date } });
  }

  async insertCall({ ip, url, date }: { ip: string; url: string; date: Date }) {
    return ApiCallsModel.insertOne({ date, ip, url });
  }
}
