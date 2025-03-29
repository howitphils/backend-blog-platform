import { Request, Response } from "express";
import { ObjectId } from "mongodb";
import { UserInputModel, UsersRequestQueryType } from "../../types/users-types";
import { usersQueryRepository } from "../../db/mongodb/repositories/users-repository/users-query-repository";
import { usersService } from "../../services/users-service";
import { mapUsersQueryParams } from "./utils";

export const usersController = {
  // Получение юзеров
  async getUsers(
    req: Request<{}, {}, {}, UsersRequestQueryType>,
    res: Response
  ) {
    // Преобразуем query параметры в нужный формат
    const mapedQueryParams = mapUsersQueryParams(req.query);

    // Получаем юзеров из бд
    const users = await usersQueryRepository.getAllUsers(mapedQueryParams);

    res.status(200).json(users);
  },

  // Создание юзера
  async createUser(req: Request<{}, {}, UserInputModel>, res: Response) {
    // Создаем нового юзера
    const createResult = await usersService.createNewUser(req.body);

    // Если пришел объект с ошибкой
    if (!ObjectId.isValid(createResult.toString())) {
      res.status(400).json(createResult);
      return;
    }

    // Получаем созданного юзера по айди
    const newUser = await usersQueryRepository.getUserById(
      createResult as ObjectId
    );
    res.status(201).json(newUser);
  },

  // Удаление юзера
  async deleteUser(req: Request<{ id: ObjectId }>, res: Response) {
    // Удаляем юзера
    const isDeleted = await usersService.deleteUser(req.params.id);
    // Если юзер не найден, возвращаем 404
    if (!isDeleted) {
      res.sendStatus(404);
      return;
    }
    res.sendStatus(204);
  },
};
