import { Request, Response } from "express";
import { ObjectId } from "mongodb";
import { PostInputModel, PostsRequestQueryType } from "../../types/posts-types";
import { mapCommentsQueryParams, mapPostsQueryParams } from "./utils";
import { postsQueryRepository } from "../../db/mongodb/repositories/posts-repository/posts-query-repository";
import { postsService } from "../../services/posts-service";
import { commentsService } from "../../services/comments-service";
import {
  CommentInputModel,
  CommentsRequestQueryType,
  CreateCommentDto,
} from "../../types/comments-types";
import { commentsQueryRepository } from "../../db/mongodb/repositories/comments-repository/comments-query-repository";

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

  async getComments(
    req: Request<{ id: ObjectId }, {}, {}, CommentsRequestQueryType>,
    res: Response
  ) {
    // Получаем пост по id из запроса
    const targetPost = await postsQueryRepository.getPostById(req.params.id);
    // Если пост не найден, отправляем 404
    if (!targetPost) {
      res.sendStatus(404);
      return;
    }

    // Преобразуем query параметры в нужный формат
    const mapedQueryParams = mapCommentsQueryParams(req.query);

    const convertedPostId = req.params.id.toString();

    // Получаем комментарии из бд
    const comments = await commentsQueryRepository.getAllCommentsForPost(
      mapedQueryParams,
      convertedPostId
    );

    res.status(200).json(comments);
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

  // Создание комментария
  async createComment(
    req: Request<{ id: ObjectId }, {}, CommentInputModel>,
    res: Response
  ) {
    const userId = req.user?.id;
    if (!userId) {
      // Заменить на 500
      res.sendStatus(401);
      return;
    }
    const postId = req.params.id;
    const commentBody = req.body;

    const createCommentDto: CreateCommentDto = {
      userId,
      postId,
      commentBody,
    };

    // Создаем новый комментарий
    const createdId = await commentsService.createNewComment(createCommentDto);
    if (!createdId) {
      res.sendStatus(404);
      return;
    }
    // Получаем созданный комментарий
    const newComment = await commentsQueryRepository.getCommentById(createdId);
    res.status(201).json(newComment);
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
