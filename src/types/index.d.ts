import { UserId } from "./users-types";

declare global {
  namespace Express {
    export interface Request {
      user: {
        id: string;
        deviceId?: string;
        iat?: number;
      };
    }
  }
}

declare global {
  namespace Express {
    export interface AuthRequest extends Request {
      user: {
        id: string;
        deviceId: string;
        iat: number;
      };
    }
  }
}
