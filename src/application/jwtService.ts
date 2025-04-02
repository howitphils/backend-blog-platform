import jwt from "jsonwebtoken";
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
      jwt.verify(token, SETTINGS.JWT_SECRET);
    } catch (error) {
      return null;
    }
  },
};
