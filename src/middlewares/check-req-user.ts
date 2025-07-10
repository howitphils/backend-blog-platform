import { NextFunction, Request, Response } from "express";

export const checkUserInRequest = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user || !req.user.id) {
      throw new Error("User id does not exist in request");
    }
    next();
  } catch (error) {
    next(error);
  }
};
