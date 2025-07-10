import mongoose from "mongoose";
import { ApiCallType } from "../../../../types/apiCalls";

const ApiCallsSchema = new mongoose.Schema<ApiCallType>({
  date: { type: Date, required: true },
  ip: { type: String, required: true },
  url: { type: String, required: true },
});

type ApiCallsModel = mongoose.Model<ApiCallType>;

export type ApiCallDbDocument = mongoose.HydratedDocument<ApiCallType>;

export const ApiCallsModel = mongoose.model<ApiCallType, ApiCallsModel>(
  "ApiCall",
  ApiCallsSchema
);
