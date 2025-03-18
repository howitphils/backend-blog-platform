import { ObjectId } from "mongodb";
import { Request, Response } from "express";

import {
  BlogInputModel,
  BlogsRequestQueryType,
  PostForBlogType,
} from "../../types/blogs-types";
import { blogsService } from "../../services/blogs-service";
import { blogsQueryRepository } from "../../db/mongodb/repositories/blogs-repository/blogs-query-repositoy";
import { mapBlogsQueryParams } from "./utils";
import { postsQueryRepository } from "../../db/mongodb/repositories/posts-repository/posts-query-repository";

export const blogsController = {
  async getBlogs(
    req: Request<{}, {}, {}, BlogsRequestQueryType>,
    res: Response
  ) {
    const mapedQueryParams = mapBlogsQueryParams(req.query);

    const blogs = await blogsQueryRepository.getAllBlogs(mapedQueryParams);

    res.status(200).json(blogs);
  },
  async getPostsByBlogId(
    req: Request<{ id: ObjectId }, {}, {}, BlogsRequestQueryType>,
    res: Response
  ) {
    const mapedQueryParams = mapBlogsQueryParams(req.query);
    const posts = await blogsQueryRepository.getAllPostsByBlogId(
      req.params.id,
      mapedQueryParams
    );
    res.status(200).json(posts);
  },
  async createBlog(
    req: Request<{ id: string }, {}, BlogInputModel>,
    res: Response
  ) {
    const createdBlogId = await blogsService.createNewBlog(req.body);
    const newBlog = await blogsQueryRepository.getBlogById(createdBlogId);
    res.status(201).json(newBlog);
  },

  async createPostForBlog(
    req: Request<{ id: ObjectId }, {}, PostForBlogType>,
    res: Response
  ) {
    const newPostId = await blogsService.createNewPostForBlog(
      req.params.id.toString(),
      req.body
    );
    const newPost = await postsQueryRepository.getPostById(newPostId);
    res.status(200).json(newPost);
  },

  async getBlogById(req: Request<{ id: ObjectId }>, res: Response) {
    const targetBlog = await blogsQueryRepository.getBlogById(req.params.id);
    if (!targetBlog) {
      res.sendStatus(404);
      return;
    }
    res.status(200).json(targetBlog);
  },
  async updateBlog(
    req: Request<{ id: ObjectId }, {}, BlogInputModel>,
    res: Response
  ) {
    const isUpdated = await blogsService.updateBlog(req.params.id, req.body);
    if (!isUpdated) {
      res.sendStatus(404);
      return;
    }
    res.sendStatus(204);
  },
  async deleteBlog(req: Request<{ id: ObjectId }>, res: Response) {
    const isDeleted = await blogsService.deleteBlog(req.params.id);
    if (!isDeleted) {
      res.sendStatus(404);
      return;
    }
    res.sendStatus(204);
  },
};
