import {
  FieldValidationError,
  ValidationError,
  validationResult,
} from "express-validator";
import { ErrorMessageType } from "../types/output-errors-types";
import { NextFunction, Request, Response } from "express";
import { HttpStatuses } from "../types/http-statuses";

const createOutputErrors = (errors: ValidationError): ErrorMessageType => {
  // Переприсваиваем тип
  const targetOutputErrors = errors as unknown as FieldValidationError;
  // Возвращаем объект нужной структуры
  return {
    message: targetOutputErrors.msg,
    field: targetOutputErrors.path,
  };
};

export const bodyValidationResult = (
  req: Request<{}>,
  res: Response,
  next: NextFunction
) => {
  const errros = validationResult(req) // Получаем ошибки валидации в виде массива
    .formatWith(createOutputErrors) // Преобразуем ошибки в нужный формат
    .array({ onlyFirstError: true }); // Возвращаем только первую ошибку из каждого поля

  // Если ошибки есть, возвращаем и отправляем их клиенту
  if (errros.length) {
    res.status(HttpStatuses.BadRequest).json({ errorsMessages: errros });
    return;
  }

  next();
};
