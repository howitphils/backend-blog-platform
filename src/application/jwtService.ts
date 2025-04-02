import jwt, { JwtPayload } from "jsonwebtoken";
import { ObjectId } from "mongodb";
import { SETTINGS } from "../settings";

export const jwtService = {
  createJwt(userId: ObjectId) {
    const token = jwt.sign({ userId }, SETTINGS.JWT_SECRET, {
      expiresIn: "2h",
    });
    return token;
  },
  verifyToken(token: string) {
    try {
      const verified = jwt.verify(token, SETTINGS.JWT_SECRET) as JwtPayload;
      return verified.userId;
    } catch (error) {
      return null;
    }
  },
};
