import { Request, Response } from "express";
import { ObjectId } from "mongodb";
import { PostInputModel, PostsRequestQueryType } from "../../types/posts-types";
import { mapPostsQueryParams } from "./utils";
import { postsQueryRepository } from "../../db/mongodb/repositories/posts-repository/posts-query-repository";
import { postsService } from "../../services/posts-service";

export const postsController = {
  // Получение постов
  async getPosts(
    req: Request<{}, {}, {}, PostsRequestQueryType>,
    res: Response
  ) {
    // Преобразуем query параметры в нужный формат
    const mapedQueryParams = mapPostsQueryParams(req.query);

    // Получаем посты из базы
    const posts = await postsQueryRepository.getAllPosts(mapedQueryParams);

    res.status(200).json(posts);
  },

  // Создание поста
  async createPost(req: Request<{}, {}, PostInputModel>, res: Response) {
    // Создаем новый пост
    const createdId = await postsService.createNewPost(req.body);
    if (!createdId) {
      res.sendStatus(404);
      return;
    }
    // Получаем созданный пост
    const newPost = await postsQueryRepository.getPostById(createdId);
    res.status(201).json(newPost);
  },

  // Получение поста по айди
  async getPostById(req: Request<{ id: ObjectId }>, res: Response) {
    // Получаем пост по айди
    const targetPost = await postsQueryRepository.getPostById(req.params.id);
    // Если пост не найден, возвращаем 404
    if (!targetPost) {
      res.sendStatus(404);
      return;
    }
    res.status(200).json(targetPost);
  },

  // Обновление поста
  async updatePost(
    req: Request<{ id: ObjectId }, {}, PostInputModel>,
    res: Response
  ) {
    // Обновляем пост
    const isUpdated = await postsService.updatePost(req.params.id, req.body);
    // Если пост не найден, возвращаем 404
    if (!isUpdated) {
      res.sendStatus(404);
      return;
    }
    res.sendStatus(204);
  },

  // Удаление поста
  async deletePost(req: Request<{ id: ObjectId }>, res: Response) {
    // Удаляем пост
    const isDeleted = await postsService.deletePost(req.params.id);
    // Если пост не найден, возвращаем 404
    if (!isDeleted) {
      res.sendStatus(404);
      return;
    }
    res.sendStatus(204);
  },
};
