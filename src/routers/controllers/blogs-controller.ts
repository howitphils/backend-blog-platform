import { Request, Response } from "express";

import { ObjectId } from "mongodb";
import { BlogInputModel } from "../../types/blogs-types";
import { RequestQueryType } from "../../types/request-types";
import { blogsService } from "../../services/blogs-service";

export const blogsController = {
  async getBlogs(req: Request<{}, {}, {}, RequestQueryType>, res: Response) {
    const blogs = await blogsService.getAllBlogs(req.query);
    res.status(200).json(blogs);
  },
  async createBlog(req: Request<{}, {}, BlogInputModel>, res: Response) {
    const createdBlogId = await blogsService.createNewBlog(req.body);
    const newBlog = await blogsService.getBlogById(createdBlogId);
    res.status(201).json(newBlog);
  },
  async getBlogById(req: Request<{ id: ObjectId }>, res: Response) {
    const targetBlog = await blogsService.getBlogById(req.params.id);
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
