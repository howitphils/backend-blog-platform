import jwt, { JwtPayload } from "jsonwebtoken";
import { ObjectId } from "mongodb";
import { SETTINGS } from "../settings";

export const jwtService = {
  createJwtPair(userId: ObjectId) {
    const accessToken = jwt.sign({ userId }, SETTINGS.JWT_SECRET, {
      expiresIn: "10s",
    });
    const refreshToken = jwt.sign({ userId }, SETTINGS.JWT_SECRET, {
      expiresIn: "20s",
    });
    return { accessToken, refreshToken };
  },
  verifyToken(token: string) {
    try {
      return jwt.verify(token, SETTINGS.JWT_SECRET) as JwtPayload;
    } catch (error) {
      console.log(error);
      return null;
    }
  },
};
