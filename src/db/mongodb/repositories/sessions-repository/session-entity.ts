import mongoose from "mongoose";

export class Session {
  userId: string;
  deviceId: string;
  iat: number;
  exp: number;
  ip: string;
  device_name: string;

  constructor(
    userId: string,
    deviceId: string,
    iat: number,
    exp: number,
    ip: string,
    deviceName: string
  ) {
    this.userId = userId;
    this.deviceId = deviceId;
    this.iat = iat;
    this.exp = exp;
    this.ip = ip;
    this.device_name = deviceName;
  }
}

const SessionsSchema = new mongoose.Schema<Session>({});

type SessionsModel = mongoose.Model<Session>;

export type SessionDbDocument = mongoose.HydratedDocument<Session>;

export const SessionsModel = mongoose.model<Session, SessionsModel>(
  "Session",
  SessionsSchema
);
