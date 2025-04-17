import { Response } from "express";
import { PostInputModel, PostsRequestQueryType } from "../../types/posts-types";
import {
  convertToHttpCode,
  mapCommentsQueryParams,
  mapPostsQueryParams,
} from "./utils";
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
import { ObjectId } from "mongodb";
import { HttpStatuses } from "../../types/http-statuses";

export const postsController = {
  async getPosts(req: RequestWithQuery<PostsRequestQueryType>, res: Response) {
    const mapedQueryParams = mapPostsQueryParams(req.query);

    const posts = await postsQueryRepository.getAllPosts(mapedQueryParams);

    res.status(HttpStatuses.Success).json(posts);
  },

  async getComments(
    req: RequestWithParamsAndQuery<ParamsId, CommentsRequestQueryType>,
    res: Response
  ) {
    const targetPost = await postsQueryRepository.getPostById(req.params.id);

    if (!targetPost) {
      res.sendStatus(HttpStatuses.NotFound);
      return;
    }

    const mapedQueryParams = mapCommentsQueryParams(req.query);
    const convertedPostId = req.params.id.toString();

    const comments = await commentsQueryRepository.getAllCommentsForPost(
      mapedQueryParams,
      convertedPostId
    );

    res.status(HttpStatuses.Success).json(comments);
  },

  async createPost(req: RequestWithBody<PostInputModel>, res: Response) {
    const createdId = await postsService.createNewPost(req.body);

    if (!createdId) {
      res.sendStatus(HttpStatuses.NotFound);
      return;
    }

    const newPost = await postsQueryRepository.getPostById(createdId);

    res.status(HttpStatuses.Created).json(newPost);
  },

  async createComment(
    req: RequestWithParamsAndBody<ParamsId, CommentInputModel>,
    res: Response
  ) {
    const userId = req.user?.id;
    if (!userId) {
      res.sendStatus(HttpStatuses.ServerError);
      return;
    }
    const postId = req.params.id;
    const commentBody = req.body;

    const createCommentDto: CreateCommentDto = {
      userId,
      postId,
      commentBody,
    };

    const createResult = await commentsService.createNewComment(
      createCommentDto
    );

    if (createResult.status !== "Success") {
      res
        .sendStatus(convertToHttpCode(createResult.status))
        .json(createResult.extensions);
      return;
    }

    const newComment = await commentsQueryRepository.getCommentById(
      createResult.data as ObjectId
    );

    res.status(HttpStatuses.Created).json(newComment);
  },

  async getPostById(req: RequestWithParams<ParamsId>, res: Response) {
    const targetPost = await postsQueryRepository.getPostById(req.params.id);

    if (!targetPost) {
      res.sendStatus(HttpStatuses.NotFound);
      return;
    }

    res.status(HttpStatuses.Success).json(targetPost);
  },

  async updatePost(
    req: RequestWithParamsAndBody<ParamsId, PostInputModel>,
    res: Response
  ) {
    const isUpdated = await postsService.updatePost(req.params.id, req.body);

    if (!isUpdated) {
      res.sendStatus(HttpStatuses.NotFound);
      return;
    }

    res.sendStatus(HttpStatuses.NoContent);
  },

  async deletePost(req: RequestWithParams<ParamsId>, res: Response) {
    const isDeleted = await postsService.deletePost(req.params.id);

    if (!isDeleted) {
      res.sendStatus(HttpStatuses.NotFound);
      return;
    }

    res.sendStatus(HttpStatuses.NoContent);
  },
};
