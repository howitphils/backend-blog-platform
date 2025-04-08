import { UserId } from "./users-types";

declare global {
  namespace Express {
    export interface Request {
      user?: UserId;
    }
  }
}
