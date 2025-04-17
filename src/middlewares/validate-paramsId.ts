import { NextFunction, Request, Response } from "express";
import { ObjectId } from "mongodb";
import { HttpStatuses } from "../types/http-statuses";

// Валидация параметра id в запросе на наличие валидного ObjectId
export const validateParamsId = (
  req: Request<{ id: string | ObjectId }>,
  res: Response,
  next: NextFunction
) => {
  // Получение id из параметров запроса
  const incomingId = req.params.id;

  // Проверка на валидный ObjectId
  if (!ObjectId.isValid(incomingId)) {
    res.sendStatus(HttpStatuses.NotFound);
    return;
  }

  // Преобразование id в ObjectId и запись в параметры запроса
  req.params.id = new ObjectId(incomingId);

  next();
};
