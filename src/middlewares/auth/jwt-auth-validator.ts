import { authService } from "./../../services/auth-service";
import { Response, NextFunction, Request } from "express";
import { HttpStatuses } from "../../types/http-statuses";
import { ResultStatus } from "../../types/resultObject-types";

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

  const verificationResult = authService.checkAccessToken(
    req.headers.authorization
  );

  if (verificationResult.status !== ResultStatus.Success) {
    res.sendStatus(HttpStatuses.Unauthorized);
  } else {
    req.user = { id: verificationResult.data as string };
  }

  next();
};
