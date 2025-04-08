import { Response } from "express";
import { ObjectId } from "mongodb";
import { mapUsersQueryParams } from "./utils";
import { usersService } from "../../services/users-service";

import {
  UserInputModel,
  UsersRequestQueryType,
  UserViewModel,
} from "../../types/users-types";
import { usersQueryRepository } from "../../db/mongodb/repositories/users-repository/users-query-repository";
import { PaginationType, ParamsId } from "../../types/common-types";
import {
  RequestWithBody,
  RequestWithParams,
  RequestWithQuery,
} from "../../types/requests-types";

export const usersController = {
  // Получение юзеров
  async getUsers(
    req: RequestWithQuery<UsersRequestQueryType>,
    res: Response<PaginationType<UserViewModel>>
  ) {
    const mapedQueryParams = mapUsersQueryParams(req.query);

    const users = await usersQueryRepository.getAllUsers(mapedQueryParams);

    res.status(200).json(users);
  },

  // Создание юзера
  async createUser(req: RequestWithBody<UserInputModel>, res: Response) {
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
  async deleteUser(req: RequestWithParams<ParamsId>, res: Response) {
    const isDeleted = await usersService.deleteUser(req.params.id);

    if (!isDeleted) {
      res.sendStatus(404);
      return;
    }
    res.sendStatus(204);
  },
};
