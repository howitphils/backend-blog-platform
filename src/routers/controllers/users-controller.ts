import { Request, Response } from "express";
import { ObjectId } from "mongodb";
import { PostInputModel, PostsRequestQueryType } from "../../types/posts-types";
import { mapPostsQueryParams, mapUsersQueryParams } from "./utils";
import { postsQueryRepository } from "../../db/mongodb/repositories/posts-repository/posts-query-repository";
import { postsService } from "../../services/posts-service";
import { UserInputModel, UsersRequestQueryType } from "../../types/users-types";
import { usersQueryRepository } from "../../db/mongodb/repositories/users-repository/users-query-repository";
import { usersService } from "../../services/users-service";

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
    const createdId = await usersService.createNewUser(req.body);
    // Получаем созданного юзера
    const newUser = await usersQueryRepository.getUserById(createdId);
    res.status(201).json(newUser);
  },

  // Удаление поста
  async deleteUser(req: Request<{ id: ObjectId }>, res: Response) {
    // Удаляем пост
    // const isDeleted = await postsService.deletePost(req.params.id);
    // Если пост не найден, возвращаем 404
    // if (!isDeleted) {
    //   res.sendStatus(404);
    //   return;
    // }
    // res.sendStatus(204);
  },
};
