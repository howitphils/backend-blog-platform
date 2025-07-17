import { Request, Response, NextFunction } from "express";
import { HttpStatuses } from "../types/http-statuses";
import { APP_CONFIG } from "../settings";
import { container } from "../composition-root";
import { ApiCallsRepository } from "../db/mongodb/repositories/api-calls-repository/apiCalls-repository";
import { dateFnsService } from "../adapters/dateFnsService";

const apiCallsRepository = container.get(ApiCallsRepository);

export const apiCallsGuard = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  //TODO: написать тесты на проверку количества запросов

  const { originalUrl, ip } = req;
  const secondsAgoDate = dateFnsService.rollBackBySeconds(
    APP_CONFIG.REQUEST_LIMIT_PERIOD
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

  if (count >= APP_CONFIG.REQUEST_LIMIT) {
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
