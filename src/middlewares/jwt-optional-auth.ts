import { Response, NextFunction, Request } from "express";
import { container } from "../composition-root";
import { AuthService } from "../services/auth-service";
import { ResultStatus } from "../types/resultObject-types";

const authService = container.get(AuthService);

export const jwtAuthOptional = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.headers.authorization) {
    req.user = { id: "" }; // No user authenticated

    next();
    return;
  }

  const verificationResult = authService.checkAccessToken(
    req.headers.authorization
  );

  if (verificationResult.status === ResultStatus.Success) {
    req.user = { id: verificationResult.data as string };

    next();

    return;
  }

  req.user = { id: "" };

  next();
};
