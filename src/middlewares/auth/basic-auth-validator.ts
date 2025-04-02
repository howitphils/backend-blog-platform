import { NextFunction, Request, Response } from "express";
import { SETTINGS } from "../../settings";

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
    res.sendStatus(401);
    return;
  }

  // Разбиваем содержимое заголовка на тип авторизации и токен
  const [authType, authToken] = auth.split(" ");

  // Если тип авторизации не Basic, возвращаем статус 401
  if (authType !== "Basic") {
    res.sendStatus(401);
    return;
  }

  // Если токен не равен закодированным логину и паролю, возвращаем статус 401
  if (authToken !== encodedCredentials) {
    res.sendStatus(401);
    return;
  }

  next();
};
