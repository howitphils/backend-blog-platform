import { NextFunction, Request, Response } from "express";
import { APP_CONFIG } from "../../settings";
import { HttpStatuses } from "../../types/http-statuses";
import { container } from "../../composition-root";
import { JwtService } from "../../adapters/jwtService";
import { ErrorWithStatusCode } from "../error-handler";

const jwtService = container.get(JwtService);

export const refreshTokenValidator = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const refreshToken = req.cookies[APP_CONFIG.REFRESH_TOKEN_COOKIE_NAME];

  if (!refreshToken) {
    throw new ErrorWithStatusCode(
      "Refresh token is missing",
      HttpStatuses.Unauthorized
    );
  }

  const verified = jwtService.verifyRefreshToken(refreshToken);

  if (!verified) {
    throw new ErrorWithStatusCode(
      "Refresh token is not valid",
      HttpStatuses.Unauthorized
    );
  }

  //TODO достать из токена девайсИд, время выпуска и закинуть в реквест
  req.user = {
    id: verified.userId,
    deviceId: verified.deviceId,
    iat: verified.iat as number,
  };

  next();
};
