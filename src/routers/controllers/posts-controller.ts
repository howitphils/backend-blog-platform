import { Response } from "express";
import {
  PostInputModel,
  PostsRequestQueryType,
  PostViewModel,
} from "../../types/posts-types";
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
  CommentViewModel,
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
import { PaginationType, ParamsId } from "../../types/common-types";
import { ObjectId } from "mongodb";
import { HttpStatuses } from "../../types/http-statuses";
import { ExtensionType } from "../../types/resultObject-types";

export const postsController = {
  async getPosts(
    req: RequestWithQuery<PostsRequestQueryType>,
    res: Response<PaginationType<PostViewModel>>
  ) {
    const mapedQueryParams = mapPostsQueryParams(req.query);

    const posts = await postsQueryRepository.getAllPosts(mapedQueryParams);

    res.status(HttpStatuses.Success).json(posts);
  },

  async getComments(
    req: RequestWithParamsAndQuery<ParamsId, CommentsRequestQueryType>,
    res: Response<PaginationType<CommentViewModel>>
  ) {
    await postsService.getPostById(req.params.id);

    const mapedQueryParams = mapCommentsQueryParams(req.query);
    const convertedPostId = req.params.id.toString();

    const comments = await commentsQueryRepository.getAllCommentsForPost(
      mapedQueryParams,
      convertedPostId
    );

    res.status(HttpStatuses.Success).json(comments);
  },

  async createPost(
    req: RequestWithBody<PostInputModel>,
    res: Response<PostViewModel>
  ) {
    const createdId = await postsService.createNewPost(req.body);

    const newPost = await postsQueryRepository.getPostById(createdId);

    if (!newPost) {
      res.sendStatus(HttpStatuses.NotFound);
      return;
    }

    res.status(HttpStatuses.Created).json(newPost);
  },

  async createComment(
    req: RequestWithParamsAndBody<ParamsId, CommentInputModel>,
    res: Response<CommentViewModel | ExtensionType[]>
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

    if (!newComment) {
      res.sendStatus(HttpStatuses.NotFound);
      return;
    }

    res.status(HttpStatuses.Created).json(newComment);
  },

  async getPostById(
    req: RequestWithParams<ParamsId>,
    res: Response<PostViewModel>
  ) {
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
    await postsService.updatePost(req.params.id, req.body);
    res.sendStatus(HttpStatuses.NoContent);
  },

  async deletePost(req: RequestWithParams<ParamsId>, res: Response) {
    await postsService.deletePost(req.params.id);
    res.sendStatus(HttpStatuses.NoContent);
  },
};
