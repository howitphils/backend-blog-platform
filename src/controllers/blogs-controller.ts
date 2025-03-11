import { Request, Response } from "express";
import { BlogInputModel } from "../types/blogs-types";
import { blogsRepository } from "../db/mongodb/repositories/blogs-db-repository";

export const blogsController = {
  async getBlogs(req: Request, res: Response) {
    const blogs = await blogsRepository.getAllBlogs();
    res.status(200).json(blogs);
  },
  async createBlog(req: Request<{}, {}, BlogInputModel>, res: Response) {
    const createdBlogId = await blogsRepository.createNewBlog(req.body);
    const newBlog = await blogsRepository.getBlogByUUId(createdBlogId);
    res.status(201).json(newBlog);
  },
  async getBlogById(req: Request<{ id: string }>, res: Response) {
    const targetBlog = await blogsRepository.getBlogById(req.params.id);
    if (!targetBlog) {
      res.sendStatus(404);
      return;
    }
    res.status(200).json(targetBlog);
  },
  async updateBlog(
    req: Request<{ id: string }, {}, BlogInputModel>,
    res: Response
  ) {
    const isUpdated = await blogsRepository.updateBlog(req.params.id, req.body);
    if (!isUpdated) {
      res.sendStatus(404);
      return;
    }
    res.sendStatus(204);
  },
  async deleteBlog(req: Request<{ id: string }>, res: Response) {
    const isDeleted = await blogsRepository.deleteBlog(req.params.id);
    if (!isDeleted) {
      res.sendStatus(404);
      return;
    }
    res.sendStatus(204);
  },
};
