import { Request } from "express";
import { UserId } from "./users-types";

export type RequestWithBody<B> = Request<{}, {}, B>;
export type RequestWithQuery<Q> = Request<{}, {}, {}, Q>;
export type RequestWithParams<P> = Request<P>;
export type RequestWithParamsAndBody<P, B> = Request<P, {}, B>;
export type RequestWithParamsAndQuery<P, Q> = Request<P, {}, {}, Q>;
export type RequestWithParamsAndBodyAndUserId<P, B, U extends UserId> = Request<
  P,
  {},
  B,
  {},
  U
>;
export type RequestWithBodyAndUserId<B, U extends UserId> = Request<
  {},
  {},
  B,
  {},
  U
>;
export type RequestWithUserId<U extends UserId> = Request<{}, {}, {}, {}, U>;
export type RequestWithParamsAndUserId<P, U extends UserId> = Request<
  P,
  {},
  {},
  {},
  U
>;
