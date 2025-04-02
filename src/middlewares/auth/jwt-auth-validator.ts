import { Request, Response, NextFunction } from "express";
import { jwtService } from "../../application/jwtService";

export const jwtAuthGuard = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.headers.authorization) {
    console.log("no headers");

    res.sendStatus(401);
    return;
  }

  const [authType, token] = req.headers.authorization.split(" ");

  if (authType !== "Bearer") {
    console.log("wrong type");

    res.sendStatus(401);
    return;
  }

  const verifiedUser = jwtService.verifyToken(token);

  if (!verifiedUser) {
    console.log("no verified");
    res.sendStatus(401);
    return;
  }
  // Add user to request
};
