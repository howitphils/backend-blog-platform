import { NextFunction, Request, Response } from "express";

const VALID_USERNAME = "admin";
const VALID_PASSWORD = "qwerty";

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

  const [username, password] = Buffer.from(authToken, "base64")
    .toString("utf-8")
    .split(":");

  if (username !== VALID_USERNAME || password !== VALID_PASSWORD) {
    res.sendStatus(401);
    return;
  }
  next();
};
