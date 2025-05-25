import { decode, JwtPayload, sign, verify } from "jsonwebtoken";
import { SETTINGS } from "../settings";
import { TokenPairType } from "../types/login-types";
import { uuIdService } from "./uuIdService";

export interface JwtPayloadRefresh extends JwtPayload {
  userId: string;
  deviceId: string;
}

export const jwtService = {
  createAccessToken(payload: { userId: string }) {
    return sign(payload, SETTINGS.JWT_SECRET_ACCESS, {
      expiresIn: "10s",
    });
  },

  createRefreshToken(payload: { userId: string; deviceId: string }) {
    return sign(payload, SETTINGS.JWT_SECRET_REFRESH, {
      expiresIn: "20s",
    });
  },

  createJwtPair(userId: string): TokenPairType {
    const deviceId = uuIdService.createRandomCode();

    const accessToken = this.createAccessToken({ userId });
    const refreshToken = this.createRefreshToken({ userId, deviceId });

    return { accessToken, refreshToken };
  },

  decodeToken(token: string) {
    try {
      const decoded = decode(token);
      if (!decoded) {
        throw new Error("Can't decode");
      }
      return decoded;
    } catch (error) {
      console.log(error);
    }
  },

  verifyToken(token: string, secretKey: string) {
    try {
      return verify(token, secretKey);
    } catch (error) {
      console.log(error);
      return null;
    }
  },

  verifyAccessToken(token: string): { userId: string } {
    return this.verifyToken(token, SETTINGS.JWT_SECRET_ACCESS) as {
      userId: string;
    };
  },

  verifyRefreshToken(token: string): { userId: string } {
    return this.verifyToken(token, SETTINGS.JWT_SECRET_REFRESH) as {
      userId: string;
    };
  },
};
