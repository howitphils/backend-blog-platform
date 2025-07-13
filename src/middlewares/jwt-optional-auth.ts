import { Response, NextFunction, Request } from "express";
import { container } from "../composition-root";
import { AuthService } from "../services/auth-service";
import { ResultStatus } from "../types/resultObject-types";
import { ErrorWithStatusCode } from "./error-handler";
import { HttpStatuses } from "../types/http-statuses";

const authService = container.get(AuthService);

export const jwtAuthOptional = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.headers.authorization) {
    next();
    return;
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
