import { Request, Response, NextFunction } from "express";
import { HttpStatuses } from "../types/http-statuses";

export class CustomError extends Error {
  public readonly statusCode: number;

  constructor(message: string, statusCode: HttpStatuses) {
    super(message);
    this.statusCode = statusCode;
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
  console.log(JSON.stringify(err));
  res.sendStatus(500).json({ message: "Unexpected error" });
};
