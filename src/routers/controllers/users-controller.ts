import { Response } from "express";
import { mapUsersQueryParams } from "./utils";

import {
  UserInputModel,
  UsersRequestQueryType,
  UserViewModel,
} from "../../types/users-types";
import { PaginationType, ParamsId } from "../../types/common-types";
import {
  RequestWithBody,
  RequestWithParams,
  RequestWithQuery,
} from "../../types/requests-types";
import { HttpStatuses } from "../../types/http-statuses";
import { UsersQueryRepository } from "../../db/mongodb/repositories/users-repository/users-query-repository";
import { UsersService } from "../../services/users-service";
import { inject, injectable } from "inversify";

@injectable()
export class UsersController {
  constructor(
    @inject(UsersQueryRepository)
    private usersQueryRepository: UsersQueryRepository,

    @inject(UsersService)
    private usersService: UsersService
  ) {}

  async getUsers(
    req: RequestWithQuery<UsersRequestQueryType>,
    res: Response<PaginationType<UserViewModel>>
  ) {
    const mapedQueryParams = mapUsersQueryParams(req.query);

    const users = await this.usersQueryRepository.getAllUsers(mapedQueryParams);

    res.status(HttpStatuses.Success).json(users);
  }

  async createUser(req: RequestWithBody<UserInputModel>, res: Response) {
    const createdUserId = await this.usersService.createNewUser(req.body, true);

    const newUser = await this.usersQueryRepository.getUserById(createdUserId);

    if (!newUser) {
      throw new Error("User is not found in create user method");
    }

    res.status(HttpStatuses.Created).json(newUser);
  }

  async deleteUser(req: RequestWithParams<ParamsId>, res: Response) {
    await this.usersService.deleteUser(req.params.id);

    res.sendStatus(HttpStatuses.NoContent);
  }
}
