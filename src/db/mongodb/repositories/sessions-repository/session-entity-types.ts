import mongoose from "mongoose";
import { SessionEntity } from "./session-entity";

export type SessionMethodsType = {
  updateSessionIatAndExp(newIat: number, newExp: number): void;
};

export type SessionStaticsType = {
  createSession(): SessionDbDocumentType;
};

export type SessionDbDocumentType = mongoose.HydratedDocument<
  SessionEntity,
  SessionMethodsType
>;

export type SessionModelType = mongoose.Model<
  SessionEntity,
  {},
  SessionMethodsType
> &
  SessionStaticsType;
