import { Response } from "express";
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
import {
  RequestWithBody,
  RequestWithParams,
  RequestWithParamsAndBody,
  RequestWithParamsAndQuery,
  RequestWithQuery,
} from "../../types/requests-types";
import { ParamsId } from "../../types/common-types";

export const postsController = {
  // Получение постов
  async getPosts(req: RequestWithQuery<PostsRequestQueryType>, res: Response) {
    const mapedQueryParams = mapPostsQueryParams(req.query);

    const posts = await postsQueryRepository.getAllPosts(mapedQueryParams);

    res.status(200).json(posts);
  },

  // Получение комментариев поста
  async getComments(
    req: RequestWithParamsAndQuery<ParamsId, CommentsRequestQueryType>,
    res: Response
  ) {
    const targetPost = await postsQueryRepository.getPostById(req.params.id);

    if (!targetPost) {
      res.sendStatus(404);
      return;
    }

    // Маппинг входных данных
    const mapedQueryParams = mapCommentsQueryParams(req.query);
    const convertedPostId = req.params.id.toString();

    const comments = await commentsQueryRepository.getAllCommentsForPost(
      mapedQueryParams,
      convertedPostId
    );

    res.status(200).json(comments);
  },

  // Создание поста
  async createPost(req: RequestWithBody<PostInputModel>, res: Response) {
    const createdId = await postsService.createNewPost(req.body);

    if (!createdId) {
      res.sendStatus(404);
      return;
    }

    const newPost = await postsQueryRepository.getPostById(createdId);

    res.status(201).json(newPost);
  },

  // Создание комментария
  async createComment(
    req: RequestWithParamsAndBody<ParamsId, CommentInputModel>,
    res: Response
  ) {
    const userId = req.user?.id;
    if (!userId) {
      res.sendStatus(500);
      return;
    }
    const postId = req.params.id;
    const commentBody = req.body;

    // Собираем входные данные
    const createCommentDto: CreateCommentDto = {
      userId,
      postId,
      commentBody,
    };

    // Создаем комментарий
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
  async getPostById(req: RequestWithParams<ParamsId>, res: Response) {
    const targetPost = await postsQueryRepository.getPostById(req.params.id);

    if (!targetPost) {
      res.sendStatus(404);
      return;
    }

    res.status(200).json(targetPost);
  },

  // Обновление поста
  async updatePost(
    req: RequestWithParamsAndBody<ParamsId, PostInputModel>,
    res: Response
  ) {
    const isUpdated = await postsService.updatePost(req.params.id, req.body);

    if (!isUpdated) {
      res.sendStatus(404);
      return;
    }

    res.sendStatus(204);
  },

  // Удаление поста
  async deletePost(req: RequestWithParams<ParamsId>, res: Response) {
    const isDeleted = await postsService.deletePost(req.params.id);

    if (!isDeleted) {
      res.sendStatus(404);
      return;
    }

    res.sendStatus(204);
  },
};
