import { Request, Response, NextFunction } from "express";
import { HttpStatuses } from "../types/http-statuses";
import { OutputErrorsType } from "../types/output-errors-types";

export class CustomError extends Error {
  public readonly statusCode: number;

  constructor(message: string, statusCode: HttpStatuses) {
    super(message);
    this.statusCode = statusCode;
  }
}

export class CustomErrorWithObject extends Error {
  public readonly statusCode: number;
  public readonly errorObj: OutputErrorsType;

  constructor(
    message: string,
    statusCode: HttpStatuses,
    errorObj: OutputErrorsType
  ) {
    super(message);
    this.statusCode = statusCode;
    this.errorObj = errorObj;
  }
}

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof CustomError) {
    res.status(err.statusCode).json({ message: err.message });
    return;
  }
  if (err instanceof CustomErrorWithObject) {
    res.status(err.statusCode).json(err.errorObj);
    return;
  }
  console.log(JSON.stringify(err));
  res
    .sendStatus(HttpStatuses.ServerError)
    .json({ message: "Unexpected error" });
};
