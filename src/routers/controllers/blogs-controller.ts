import { Response } from "express";
import { mapBlogsQueryParams, mapPostsQueryParams } from "./utils";

import {
  BlogInputModel,
  BlogsRequestQueryType,
  BlogViewModel,
} from "../../types/blogs-types";
import {
  PostForBlogInputModel,
  PostInputModel,
  PostsRequestQueryType,
  PostViewModel,
} from "../../types/posts-types";
import {
  RequestWithBody,
  RequestWithParams,
  RequestWithParamsAndBody,
  RequestWithParamsAndQuery,
  RequestWithQuery,
} from "../../types/requests-types";
import { PaginationType, ParamsId } from "../../types/common-types";
import { HttpStatuses } from "../../types/http-statuses";
import { BlogsQueryRepository } from "../../db/mongodb/repositories/blogs-repository/blogs-query-repositoy";
import { BlogsService } from "../../services/blogs-service";
import { PostsQueryRepository } from "../../db/mongodb/repositories/posts-repository/posts-query-repository";
import { PostsService } from "../../services/posts-service";
import { inject, injectable } from "inversify";

@injectable()
export class BlogsController {
  constructor(
    @inject(BlogsQueryRepository)
    public blogsQueryRepository: BlogsQueryRepository,

    @inject(BlogsService)
    public blogsService: BlogsService,

    @inject(PostsQueryRepository)
    public postsQueryRepository: PostsQueryRepository,

    @inject(PostsService)
    public postsService: PostsService
  ) {}

  async getBlogs(
    req: RequestWithQuery<BlogsRequestQueryType>,
    res: Response<PaginationType<BlogViewModel>>
  ) {
    const mapedQueryParams = mapBlogsQueryParams(req.query);

    const blogs = await this.blogsQueryRepository.getAllBlogs(mapedQueryParams);

    res.status(HttpStatuses.Success).json(blogs);
  }

  async getPostsByBlogId(
    req: RequestWithParamsAndQuery<ParamsId, PostsRequestQueryType>,
    res: Response<PaginationType<PostViewModel>>
  ) {
    await this.blogsService.getBlogById(req.params.id);

    const mapedQueryParams = mapPostsQueryParams(req.query);
    const convertedId = req.params.id.toString();

    const posts = await this.postsQueryRepository.getAllPostsByBlogId(
      convertedId,
      mapedQueryParams
    );

    res.status(HttpStatuses.Success).json(posts);
  }

  async createBlog(
    req: RequestWithBody<BlogInputModel>,
    res: Response<BlogViewModel>
  ) {
    const createdBlogId = await this.blogsService.createNewBlog(req.body);

    const newBlog = await this.blogsQueryRepository.getBlogById(createdBlogId);

    if (!newBlog) {
      res.sendStatus(HttpStatuses.NotFound);
      return;
    }

    res.status(HttpStatuses.Created).json(newBlog);
  }

  async createPostForBlog(
    req: RequestWithParamsAndBody<ParamsId, PostForBlogInputModel>,
    res: Response<PostViewModel>
  ) {
    const postInputDto: PostInputModel = {
      blogId: req.params.id.toString(),
      content: req.body.content,
      shortDescription: req.body.shortDescription,
      title: req.body.title,
    };

    const newPostId = await this.postsService.createNewPost(postInputDto);

    const newPost = await this.postsQueryRepository.getPostById(newPostId);

    if (!newPost) {
      res.sendStatus(HttpStatuses.NotFound);
      return;
    }

    res.status(HttpStatuses.Created).json(newPost);
  }

  async getBlogById(
    req: RequestWithParams<ParamsId>,
    res: Response<BlogViewModel>
  ) {
    const targetBlog = await this.blogsQueryRepository.getBlogById(
      req.params.id
    );

    if (!targetBlog) {
      res.sendStatus(HttpStatuses.NotFound);
      return;
    }

    res.status(HttpStatuses.Success).json(targetBlog);
  }

  async updateBlog(
    req: RequestWithParamsAndBody<ParamsId, BlogInputModel>,
    res: Response
  ) {
    await this.blogsService.updateBlog(req.params.id, req.body);
    res.sendStatus(HttpStatuses.NoContent);
  }

  async deleteBlog(req: RequestWithParams<ParamsId>, res: Response) {
    const deleteResult = await this.blogsService.deleteBlog(req.params.id);

    if (!deleteResult) {
      res.sendStatus(HttpStatuses.NotFound);
      return;
    }

    res.sendStatus(HttpStatuses.NoContent);
  }
}
