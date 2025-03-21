import { ObjectId } from "mongodb";
import { Request, Response } from "express";

import { BlogInputModel, BlogsRequestQueryType } from "../../types/blogs-types";
import { blogsService } from "../../services/blogs-service";
import { blogsQueryRepository } from "../../db/mongodb/repositories/blogs-repository/blogs-query-repositoy";
import { mapBlogsQueryParams, mapPostsQueryParams } from "./utils";
import { postsQueryRepository } from "../../db/mongodb/repositories/posts-repository/posts-query-repository";
import { PostInputModel, PostsRequestQueryType } from "../../types/posts-types";

export const blogsController = {
  // Получение всех блогов
  async getBlogs(
    req: Request<{}, {}, {}, BlogsRequestQueryType>,
    res: Response
  ) {
    // Преобразуем query параметры в формат, который можно использовать в запросе к БД
    const mapedQueryParams = mapBlogsQueryParams(req.query);
    // Получаем все блоги с учетом query параметров
    const blogs = await blogsQueryRepository.getAllBlogs(mapedQueryParams);
    // Отправляем ответ с полученными блогами
    res.status(200).json(blogs);
  },

  // Получение всех постов конкретного блога
  async getPostsByBlogId(
    req: Request<{ id: ObjectId }, {}, {}, PostsRequestQueryType>,
    res: Response
  ) {
    // Получаем блог по id из запроса
    const targetBlog = await blogsQueryRepository.getBlogById(req.params.id);
    // Если блог не найден, отправляем 404
    if (!targetBlog) {
      res.sendStatus(404);
      return;
    }
    // Преобразуем query параметры в формат, который можно использовать в запросе к БД
    const mapedQueryParams = mapPostsQueryParams(req.query);
    // Преобразуем id из req.params в строку
    const convertedId = req.params.id.toString();
    // Получаем все посты конкретного блога с учетом query параметров и айди блога
    const posts = await postsQueryRepository.getAllPostsByBlogId(
      convertedId,
      mapedQueryParams
    );
    res.status(200).json(posts);
  },

  // Создание нового блога
  async createBlog(req: Request<{}, {}, BlogInputModel>, res: Response) {
    // Создаем новый блог и получаем его id в формате ObjectId
    const createdBlogId = await blogsService.createNewBlog(req.body);
    // Получаем созданный блог по id
    const newBlog = await blogsQueryRepository.getBlogById(createdBlogId);
    res.status(201).json(newBlog);
  },

  // Создание нового поста для блога
  async createPostForBlog(
    req: Request<{ id: ObjectId }, {}, PostInputModel>,
    res: Response
  ) {
    // Создаем новый пост для блога и получаем его id в формате ObjectId
    const newPostId = await blogsService.createNewPostForBlog(
      req.params.id,
      req.body
    );
    // Если пост не создан, отправляем 404
    if (!newPostId) {
      res.sendStatus(404);
      return;
    }
    // Получаем созданный пост по id
    const newPost = await postsQueryRepository.getPostById(newPostId);
    res.status(201).json(newPost);
  },

  // Получение блога по айди
  async getBlogById(req: Request<{ id: ObjectId }>, res: Response) {
    // Получаем блог по id из параметров запроса
    const targetBlog = await blogsQueryRepository.getBlogById(req.params.id);
    // Если блог не найден, отправляем 404
    if (!targetBlog) {
      res.sendStatus(404);
      return;
    }
    res.status(200).json(targetBlog);
  },

  // Обновление блога
  async updateBlog(
    req: Request<{ id: ObjectId }, {}, BlogInputModel>,
    res: Response
  ) {
    // Обновляем блог по id и данным из тела запроса
    const isUpdated = await blogsService.updateBlog(req.params.id, req.body);
    // Если блог не обновлен, отправляем 404
    if (!isUpdated) {
      res.sendStatus(404);
      return;
    }
    res.sendStatus(204);
  },

  // Удаление блога
  async deleteBlog(req: Request<{ id: ObjectId }>, res: Response) {
    // Удаляем блог по id
    const isDeleted = await blogsService.deleteBlog(req.params.id);
    // Если блог не удален, отправляем 404
    if (!isDeleted) {
      res.sendStatus(404);
      return;
    }
    res.sendStatus(204);
  },
};
