import { Request, Response } from "express";
import { ObjectId } from "mongodb";
import { PostInputModel, PostsRequestQueryType } from "../../types/posts-types";
import { mapPostsQueryParams, mapUsersQueryParams } from "./utils";
import { postsQueryRepository } from "../../db/mongodb/repositories/posts-repository/posts-query-repository";
import { postsService } from "../../services/posts-service";
import { UserInputModel, UsersRequestQueryType } from "../../types/users-types";

export const usersController = {
  // Получение постов
  async getUsers(
    req: Request<{}, {}, {}, UsersRequestQueryType>,
    res: Response
  ) {
    // Преобразуем query параметры в нужный формат
    const mapedQueryParams = mapUsersQueryParams(req.query);

    // Получаем посты из базы
    // const posts = await postsQueryRepository.getAllPosts(mapedQueryParams);

    // res.status(200).json(posts);
  },

  // Создание поста
  async createUser(req: Request<{}, {}, UserInputModel>, res: Response) {
    // Создаем новый пост
    // const createdId = await postsService.createNewPost(req.body);
    // Получаем созданный пост
    // const newPost = await postsQueryRepository.getPostById(createdId);
    // res.status(201).json(newPost);
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
