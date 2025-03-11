import { NextFunction, Request, Response } from "express";
import { ObjectId } from "mongodb";

export const validateParamsId = (
  req: Request<{ id: string | ObjectId }>,
  res: Response,
  next: NextFunction
) => {
  const incomingId = req.params.id;
  if (!ObjectId.isValid(incomingId)) {
    res.sendStatus(404);
    return;
  }
  req.params.id = new ObjectId(incomingId);
  next();
};
