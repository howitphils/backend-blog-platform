import jwt, { JwtPayload } from "jsonwebtoken";
import { SETTINGS } from "../settings";

export const jwtService = {
  createJwtPair(userId: string) {
    const accessToken = jwt.sign({ userId }, SETTINGS.JWT_SECRET_ACCESS, {
      expiresIn: "10s",
    });
    const refreshToken = jwt.sign({ userId }, SETTINGS.JWT_SECRET_REFRESH, {
      expiresIn: "20s",
    });
    return { accessToken, refreshToken };
  },
  verifyToken(token: string, secretKey: string) {
    try {
      return jwt.verify(token, secretKey) as JwtPayload;
    } catch (error) {
      console.log(error);
      return null;
    }
  },
};
