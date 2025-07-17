import mongoose from "mongoose";
import { SessionModelType } from "./session-entity-types";

export class SessionEntity {
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

const SessionSchema = new mongoose.Schema<SessionEntity>({
  device_name: { type: String, required: true },
  deviceId: { type: String, required: true },
  exp: { type: Number, required: true },
  iat: { type: Number, required: true },
  ip: { type: String, required: true },
  userId: { type: String, required: true },
});

SessionSchema.loadClass(SessionEntity);

export const SessionModel = mongoose.model<SessionEntity, SessionModelType>(
  "Session",
  SessionSchema
);
