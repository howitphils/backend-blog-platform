import { NextFunction, Request, Response } from "express";
import { HttpStatuses } from "../types/http-statuses";
import { OutputErrorsType } from "../types/output-errors-types";

export class ErrorWithStatusCode extends Error {
  public readonly statusCode: number;
  public readonly errorObj: OutputErrorsType | undefined;

  constructor(
    message: string,
    statusCode: HttpStatuses,
    errorObj?: OutputErrorsType
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
  if (err instanceof ErrorWithStatusCode) {
    if (err.errorObj) {
      res.status(err.statusCode).json(err.errorObj);
    } else {
      res.status(err.statusCode).json({ message: err.message });
    }
    return;
  }

  console.log(JSON.stringify(err));
  res.status(HttpStatuses.ServerError).json({ message: "Unexpected error" });

  return;
};
