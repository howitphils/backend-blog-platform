import {
  FieldValidationError,
  ValidationError,
  validationResult,
} from "express-validator";
import { ErrorMessageType } from "../types/output-errors-types";
import { NextFunction, Request, Response } from "express";

const createOutputErrors = (errors: ValidationError): ErrorMessageType => {
  const targetOutputErrors = errors as unknown as FieldValidationError;
  return {
    message: targetOutputErrors.msg,
    field: targetOutputErrors.path,
  };
};

export const bodyValidationResult = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errros = validationResult(req)
    .formatWith(createOutputErrors)
    .array({ onlyFirstError: true });
  if (errros.length) {
    res.status(400).json({ errorsMessages: errros });
    return;
  }
  next();
};
