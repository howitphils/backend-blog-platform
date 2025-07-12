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
import {
  CommentInputModel,
  CommentsRequestQueryType,
  CommentViewModel,
} from "../../types/comments-types";
import {
  RequestWithBody,
  RequestWithParams,
  RequestWithParamsAndBody,
  RequestWithParamsAndQuery,
  RequestWithQuery,
} from "../../types/requests-types";
import { PaginationType, ParamsId } from "../../types/common-types";
import { HttpStatuses } from "../../types/http-statuses";
import { ExtensionType } from "../../types/resultObject-types";
import { PostsQueryRepository } from "../../db/mongodb/repositories/posts-repository/posts-query-repository";
import { PostsService } from "../../services/posts-service";
import { CommentsQueryRepository } from "../../db/mongodb/repositories/comments-repository/comments-query-repository";
import { CommentsService } from "../../services/comments-service";
import { inject, injectable } from "inversify";

@injectable()
export class PostsController {
  constructor(
    @inject(PostsQueryRepository)
    private postsQueryRepository: PostsQueryRepository,

    @inject(PostsService)
    private postsService: PostsService,

    @inject(CommentsQueryRepository)
    private commentsQueryRepository: CommentsQueryRepository,

    @inject(CommentsService)
    private commentsService: CommentsService
  ) {}

  async getPosts(
    req: RequestWithQuery<PostsRequestQueryType>,
    res: Response<PaginationType<PostViewModel>>
  ) {
    const mapedQueryParams = mapPostsQueryParams(req.query);

    const posts = await this.postsQueryRepository.getAllPosts(mapedQueryParams);

    res.status(HttpStatuses.Success).json(posts);
  }

  async getComments(
    req: RequestWithParamsAndQuery<ParamsId, CommentsRequestQueryType>,
    res: Response<PaginationType<CommentViewModel>>
  ) {
    await this.postsService.getPostById(req.params.id);

    const mapedQueryParams = mapCommentsQueryParams(req.query);

    const comments = await this.commentsQueryRepository.getAllCommentsForPost(
      mapedQueryParams,
      req.params.id,
      req.user.id
    );

    res.status(HttpStatuses.Success).json(comments);
  }

  async createPost(
    req: RequestWithBody<PostInputModel>,
    res: Response<PostViewModel>
  ) {
    const createdId = await this.postsService.createNewPost(req.body);

    const newPost = await this.postsQueryRepository.getPostById(createdId);

    if (!newPost) {
      res.sendStatus(HttpStatuses.NotFound);
      return;
    }

    res.status(HttpStatuses.Created).json(newPost);
  }

  async createComment(
    req: RequestWithParamsAndBody<ParamsId, CommentInputModel>,
    res: Response<CommentViewModel | ExtensionType[]>
  ) {
    const createResult = await this.commentsService.createNewComment({
      userId: req.user.id,
      postId: req.params.id,
      commentBody: req.body,
    });

    if (createResult.status !== "Success") {
      res
        .status(convertToHttpCode(createResult.status))
        .json(createResult.extensions);
      return;
    }

    const newComment = await this.commentsQueryRepository.getCommentById(
      createResult.data as string,
      req.user.id
    );

    if (!newComment) {
      throw new Error("Comment not found after creation");
    }

    res.status(HttpStatuses.Created).json(newComment);
  }

  async getPostById(
    req: RequestWithParams<ParamsId>,
    res: Response<PostViewModel>
  ) {
    const targetPost = await this.postsQueryRepository.getPostById(
      req.params.id
    );

    if (!targetPost) {
      res.sendStatus(HttpStatuses.NotFound);
      return;
    }

    res.status(HttpStatuses.Success).json(targetPost);
  }

  async updatePost(
    req: RequestWithParamsAndBody<ParamsId, PostInputModel>,
    res: Response
  ) {
    await this.postsService.updatePost(req.params.id, req.body);
    res.sendStatus(HttpStatuses.NoContent);
  }

  async deletePost(req: RequestWithParams<ParamsId>, res: Response) {
    await this.postsService.deletePost(req.params.id);
    res.sendStatus(HttpStatuses.NoContent);
  }
}
