import { Response } from "express";
import { blogsService } from "../../services/blogs-service";
import { blogsQueryRepository } from "../../db/mongodb/repositories/blogs-repository/blogs-query-repositoy";
import { postsQueryRepository } from "../../db/mongodb/repositories/posts-repository/posts-query-repository";
import { mapBlogsQueryParams, mapPostsQueryParams } from "./utils";
import { postsService } from "../../services/posts-service";

import { BlogInputModel, BlogsRequestQueryType } from "../../types/blogs-types";
import {
  PostForBlogInputModel,
  PostInputModel,
  PostsRequestQueryType,
} from "../../types/posts-types";
import {
  RequestWithBody,
  RequestWithParams,
  RequestWithParamsAndBody,
  RequestWithParamsAndQuery,
  RequestWithQuery,
} from "../../types/requests-types";
import { ParamsId } from "../../types/common-types";
import { HttpStatuses } from "../../types/http-statuses";

export const blogsController = {
  async getBlogs(req: RequestWithQuery<BlogsRequestQueryType>, res: Response) {
    const mapedQueryParams = mapBlogsQueryParams(req.query);

    const blogs = await blogsQueryRepository.getAllBlogs(mapedQueryParams);

    res.status(HttpStatuses.Success).json(blogs);
  },

  async getPostsByBlogId(
    req: RequestWithParamsAndQuery<ParamsId, PostsRequestQueryType>,
    res: Response
  ) {
    const targetBlog = await blogsQueryRepository.getBlogById(req.params.id);

    if (!targetBlog) {
      res.sendStatus(HttpStatuses.NotFound);
      return;
    }

    const mapedQueryParams = mapPostsQueryParams(req.query);
    const convertedId = req.params.id.toString();

    const posts = await postsQueryRepository.getAllPostsByBlogId(
      convertedId,
      mapedQueryParams
    );
    res.status(HttpStatuses.Success).json(posts);
  },

  async createBlog(req: RequestWithBody<BlogInputModel>, res: Response) {
    const createdBlogId = await blogsService.createNewBlog(req.body);

    const newBlog = await blogsQueryRepository.getBlogById(createdBlogId);

    res.status(HttpStatuses.Created).json(newBlog);
  },

  async createPostForBlog(
    req: RequestWithParamsAndBody<ParamsId, PostForBlogInputModel>,
    res: Response
  ) {
    const postInputDto: PostInputModel = {
      blogId: req.params.id.toString(),
      content: req.body.content,
      shortDescription: req.body.shortDescription,
      title: req.body.title,
    };

    const newPostId = await postsService.createNewPost(postInputDto);

    if (!newPostId) {
      res.sendStatus(HttpStatuses.NotFound);
      return;
    }

    const newPost = await postsQueryRepository.getPostById(newPostId);

    res.status(HttpStatuses.Created).json(newPost);
  },

  async getBlogById(req: RequestWithParams<ParamsId>, res: Response) {
    const targetBlog = await blogsQueryRepository.getBlogById(req.params.id);

    if (!targetBlog) {
      res.sendStatus(HttpStatuses.NotFound);
      return;
    }

    res.status(HttpStatuses.Success).json(targetBlog);
  },

  async updateBlog(
    req: RequestWithParamsAndBody<ParamsId, BlogInputModel>,
    res: Response
  ) {
    const isUpdated = await blogsService.updateBlog(req.params.id, req.body);

    if (!isUpdated) {
      res.sendStatus(HttpStatuses.NotFound);
      return;
    }

    res.sendStatus(HttpStatuses.NoContent);
  },

  async deleteBlog(req: RequestWithParams<ParamsId>, res: Response) {
    const isDeleted = await blogsService.deleteBlog(req.params.id);

    if (!isDeleted) {
      res.sendStatus(HttpStatuses.NotFound);
      return;
    }
    res.sendStatus(HttpStatuses.NoContent);
  },
};
