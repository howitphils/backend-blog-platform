import { sign, verify } from "jsonwebtoken";
import { SETTINGS } from "../settings";
import { TokenPairType } from "../types/login-types";

export const jwtService = {
  createAccessToken(payload: { userId: string }) {
    return sign(payload, SETTINGS.JWT_SECRET_ACCESS, {
      expiresIn: "10s",
    });
  },

  createRefreshToken(payload: { userId: string }) {
    return sign(payload, SETTINGS.JWT_SECRET_REFRESH, {
      expiresIn: "20s",
    });
  },

  createJwtPair(userId: string): TokenPairType {
    const accessToken = this.createAccessToken({ userId });
    const refreshToken = this.createRefreshToken({ userId });

    return { accessToken, refreshToken };
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
