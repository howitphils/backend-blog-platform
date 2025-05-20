import { Response, NextFunction, Request } from "express";
import { jwtService } from "../../adapters/jwtService";
import { HttpStatuses } from "../../types/http-statuses";

export const jwtAuthGuard = (
  req: Request<{}>,
  res: Response,
  next: NextFunction
) => {
  if (!req.headers.authorization) {
    console.log("no headers");

    res.sendStatus(HttpStatuses.Unauthorized);
    return;
  }

  const [authType, token] = req.headers.authorization.split(" ");

  if (authType !== "Bearer") {
    console.log("wrong type");

    res.sendStatus(HttpStatuses.Unauthorized);
    return;
  }

  const verifiedUser = jwtService.verifyAccessToken(token);

  if (!verifiedUser) {
    console.log("not verified");
    res.sendStatus(HttpStatuses.Unauthorized);
    return;
  }

  req.user = { id: verifiedUser.userId };

  next();
};
