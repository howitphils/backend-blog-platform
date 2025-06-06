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

  const verified = jwtService.verifyRefreshToken(refreshToken);

  if (!verified) {
    console.log("refresh token is not verified");

    res.sendStatus(HttpStatuses.Unauthorized);
    return;
  }

  //TODO достать из токена девайсИд, время выпуска и закинуть в реквест
  req.user = {
    id: verified.userId,
    deviceId: verified.deviceId,
    iat: verified.iat as number,
  };

  next();
};
