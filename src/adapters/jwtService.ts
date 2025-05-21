import { JwtPayload, sign, verify } from "jsonwebtoken";
import { SETTINGS } from "../settings";

export const jwtService = {
  createJwtPair(userId: string) {
    const accessToken = sign({ userId }, SETTINGS.JWT_SECRET_ACCESS, {
      expiresIn: "10s",
    });
    const refreshToken = sign({ userId }, SETTINGS.JWT_SECRET_REFRESH, {
      expiresIn: "20s",
    });
    return { accessToken, refreshToken };
  },
  verifyToken(token: string, secretKey: string) {
    try {
      return verify(token, secretKey) as JwtPayload;
    } catch (error) {
      console.log(error);
      return null;
    }
  },
};
