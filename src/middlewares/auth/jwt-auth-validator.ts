import { Request, Response, NextFunction } from "express";

export const jwtAuthGuard = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.headers.authorization) {
    res.sendStatus(401);
    return;
  }

  const [authType, token] = req.headers.authorization.split(" ");

  if (authType !== "Bearer") {
    res.sendStatus(401);
  }
};
