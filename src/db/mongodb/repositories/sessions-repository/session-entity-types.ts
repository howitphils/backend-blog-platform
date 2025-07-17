import mongoose from "mongoose";
import { SessionEntity } from "./session-entity";

export type SessionMethodsType = {};

export type SessionStaticsType = {};

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
