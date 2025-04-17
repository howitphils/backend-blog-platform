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
import { HttpStatuses } from "../../types/http-statuses";

export const usersController = {
  async getUsers(
    req: RequestWithQuery<UsersRequestQueryType>,
    res: Response<PaginationType<UserViewModel>>
  ) {
    const mapedQueryParams = mapUsersQueryParams(req.query);

    const users = await usersQueryRepository.getAllUsers(mapedQueryParams);

    res.status(HttpStatuses.Success).json(users);
  },

  async createUser(req: RequestWithBody<UserInputModel>, res: Response) {
    const createResult = await usersService.createNewUser(req.body);

    if (!ObjectId.isValid(createResult.toString())) {
      res.status(HttpStatuses.BadRequest).json(createResult);
      return;
    }

    const newUser = await usersQueryRepository.getUserById(
      createResult as ObjectId
    );

    res.status(HttpStatuses.Created).json(newUser);
  },

  async deleteUser(req: RequestWithParams<ParamsId>, res: Response) {
    const isDeleted = await usersService.deleteUser(req.params.id);

    if (!isDeleted) {
      res.sendStatus(HttpStatuses.NotFound);
      return;
    }
    res.sendStatus(HttpStatuses.NoContent);
  },
};
