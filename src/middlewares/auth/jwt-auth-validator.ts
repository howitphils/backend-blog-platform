import { Response, NextFunction, Request } from "express";
import { HttpStatuses } from "../../types/http-statuses";
import { ResultStatus } from "../../types/resultObject-types";
import { container } from "../../composition-root";
import { AuthService } from "../../services/auth-service";
import { ErrorWithStatusCode } from "../error-handler";

const authService = container.get(AuthService);

export const jwtAuthGuard = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.headers.authorization) {
    throw new ErrorWithStatusCode(
      "Authorization header is missing",
      HttpStatuses.Unauthorized
    );
  }

  const verificationResult = authService.checkAccessToken(
    req.headers.authorization
  );

  if (verificationResult.status !== ResultStatus.Success) {
    throw new ErrorWithStatusCode(
      verificationResult.errorMessage || "Invalid access token",
      HttpStatuses.Unauthorized
    );
  }

  req.user = { id: verificationResult.data as string };

  next();
};
