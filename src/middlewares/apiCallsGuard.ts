import { Request, Response, NextFunction } from "express";
import { apiCallsRepository } from "../db/mongodb/repositories/apiCalls-repository";
import { dateFnsService } from "../adapters/dateFnsService";
import { HttpStatuses } from "../types/http-statuses";
import { SETTINGS } from "../settings";

export const apiCallsGuard = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { originalUrl, ip } = req;
  const secondsAgoDate = dateFnsService.rollBackBySeconds(
    SETTINGS.REQUEST_LIMIT_PERIOD
  );

  if (!ip) {
    res.sendStatus(HttpStatuses.BadRequest);
    console.log("ip is not provided");
    return;
  }

  const count = await apiCallsRepository.getAllCallsCount({
    date: secondsAgoDate,
    ip,
    url: originalUrl,
  });

  if (count >= SETTINGS.REQUEST_LIMIT) {
    res.sendStatus(HttpStatuses.TooManyRequests);
    return;
  }

  await apiCallsRepository.insertCall({
    ip,
    url: originalUrl,
    date: new Date(),
  });

  next();
};
