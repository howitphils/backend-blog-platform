import { NextFunction, Request, Response } from "express";
import { SETTINGS } from "../settings";

export const encodedCredentials = Buffer.from(SETTINGS.ADMIN).toString(
  "base64"
);

export const authGuard = (req: Request, res: Response, next: NextFunction) => {
  const auth = req.headers["authorization"];
  if (!auth) {
    res.sendStatus(401);
    return;
  }
  const [authType, authToken] = auth.split(" ");
  if (authType !== "Basic") {
    res.sendStatus(401);
    return;
  }

  if (authToken !== encodedCredentials) {
    res.sendStatus(401);
    return;
  }

  next();
};
