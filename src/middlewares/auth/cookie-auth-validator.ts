import { NextFunction, Request, Response } from "express";
import { SETTINGS } from "../../settings";
import { HttpStatuses } from "../../types/http-statuses";
import { jwtService } from "../../adapters/jwtService";

export const refreshTokenValidator = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const refreshToken = req.cookies[SETTINGS.REFRESH_TOKEN_COOKIE_NAME];

  if (!refreshToken) {
    console.log("refresh token does not exist");

    res.sendStatus(HttpStatuses.Unauthorized);
    return;
  }

  const verified = jwtService.verifyToken(
    refreshToken,
    SETTINGS.JWT_SECRET_REFRESH
  );

  if (!verified) {
    console.log("refresh token is not verified");

    res.sendStatus(HttpStatuses.Unauthorized);
    return;
  }

  req.user = { id: verified.userId };

  next();
};
