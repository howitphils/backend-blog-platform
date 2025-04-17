import { NextFunction, Request, Response } from "express";
import { SETTINGS } from "../../settings";
import { HttpStatuses } from "../../types/http-statuses";

// Кодируем логин и пароль в base64
export const encodedCredentials = Buffer.from(SETTINGS.ADMIN).toString(
  "base64"
);

export const authGuard = (
  req: Request<{}>,
  res: Response,
  next: NextFunction
) => {
  // Получам содержимое заголовка Authorization
  const auth = req.headers["authorization"];

  // Если заголовок Authorization отсутствует, возвращаем статус 401
  if (!auth) {
    res.sendStatus(HttpStatuses.Unauthorized);
    return;
  }

  // Разбиваем содержимое заголовка на тип авторизации и токен
  const [authType, authToken] = auth.split(" ");

  // Если тип авторизации не Basic, возвращаем статус 401
  if (authType !== "Basic") {
    res.sendStatus(HttpStatuses.Unauthorized);
    return;
  }

  // Если токен не равен закодированным логину и паролю, возвращаем статус 401
  if (authToken !== encodedCredentials) {
    res.sendStatus(HttpStatuses.Unauthorized);
    return;
  }

  next();
};
