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

export const blogsController = {
  // Получение всех блогов
  async getBlogs(req: RequestWithQuery<BlogsRequestQueryType>, res: Response) {
    const mapedQueryParams = mapBlogsQueryParams(req.query);

    const blogs = await blogsQueryRepository.getAllBlogs(mapedQueryParams);

    res.status(200).json(blogs);
  },

  // Получение всех постов конкретного блога
  async getPostsByBlogId(
    req: RequestWithParamsAndQuery<ParamsId, PostsRequestQueryType>,
    res: Response
  ) {
    const targetBlog = await blogsQueryRepository.getBlogById(req.params.id);

    if (!targetBlog) {
      res.sendStatus(404);
      return;
    }

    const mapedQueryParams = mapPostsQueryParams(req.query);
    // Преобразуем id из req.params из ObjectId в строку
    const convertedId = req.params.id.toString();

    const posts = await postsQueryRepository.getAllPostsByBlogId(
      convertedId,
      mapedQueryParams
    );
    res.status(200).json(posts);
  },

  // Создание нового блога
  async createBlog(req: RequestWithBody<BlogInputModel>, res: Response) {
    const createdBlogId = await blogsService.createNewBlog(req.body);

    const newBlog = await blogsQueryRepository.getBlogById(createdBlogId);

    res.status(201).json(newBlog);
  },

  // Создание нового поста для блога
  async createPostForBlog(
    req: RequestWithParamsAndBody<ParamsId, PostForBlogInputModel>,
    res: Response
  ) {
    const newPostInputValues: PostInputModel = {
      blogId: req.params.id.toString(),
      content: req.body.content,
      shortDescription: req.body.shortDescription,
      title: req.body.title,
    };

    const newPostId = await postsService.createNewPost(newPostInputValues);

    if (!newPostId) {
      res.sendStatus(404);
      return;
    }

    const newPost = await postsQueryRepository.getPostById(newPostId);
    res.status(201).json(newPost);
  },

  // Получение блога по айди
  async getBlogById(req: RequestWithParams<ParamsId>, res: Response) {
    const targetBlog = await blogsQueryRepository.getBlogById(req.params.id);

    if (!targetBlog) {
      res.sendStatus(404);
      return;
    }

    res.status(200).json(targetBlog);
  },

  // Обновление блога
  async updateBlog(
    req: RequestWithParamsAndBody<ParamsId, BlogInputModel>,
    res: Response
  ) {
    const isUpdated = await blogsService.updateBlog(req.params.id, req.body);

    if (!isUpdated) {
      res.sendStatus(404);
      return;
    }

    res.sendStatus(204);
  },

  // Удаление блога
  async deleteBlog(req: RequestWithParams<ParamsId>, res: Response) {
    const isDeleted = await blogsService.deleteBlog(req.params.id);

    if (!isDeleted) {
      res.sendStatus(404);
      return;
    }
    res.sendStatus(204);
  },
};
