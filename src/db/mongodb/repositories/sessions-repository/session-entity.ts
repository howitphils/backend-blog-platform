import mongoose from "mongoose";
import {
  SessionDbDocumentType,
  SessionMethodsType,
  SessionModelType,
} from "./session-entity-types";
import { SessionDbType } from "../../../../types/sessions-types";

export class SessionEntity {
  userId: string;
  deviceId: string;
  iat: number;
  exp: number;
  ip: string;
  device_name: string;

  private constructor(
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

  static createSession(dto: SessionDbType): SessionDbDocumentType {
    return new SessionModel(
      new SessionEntity(
        dto.userId,
        dto.deviceId,
        dto.iat,
        dto.exp,
        dto.ip,
        dto.device_name
      )
    );
  }

  updateSessionIatAndExp(newIat: number, newExp: number) {
    this.iat = newIat;
    this.exp = newExp;
  }
}

const SessionSchema = new mongoose.Schema<
  SessionEntity,
  SessionModelType,
  SessionMethodsType
>({
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
