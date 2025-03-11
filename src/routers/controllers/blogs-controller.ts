import { Request, Response } from "express";

import { ObjectId } from "mongodb";
import { blogsRepository } from "../../db/mongodb/repositories/blogs-db-repository";
import { BlogInputModel } from "../../types/blogs-types";
import { mapFromDbToViewModel } from "./utils";

export const blogsController = {
  async getBlogs(req: Request, res: Response) {
    // Получаем массив объектов DbType
    const blogs = await blogsRepository.getAllBlogs();
    // Преобразуем во ViewModel
    const blogsView = blogs.map(mapFromDbToViewModel);
    res.status(200).json(blogsView);
  },
  async createBlog(req: Request<{}, {}, BlogInputModel>, res: Response) {
    const createdBlogId = await blogsRepository.createNewBlog(req.body);
    const newBlog = await blogsRepository.getBlogById(createdBlogId);
    if (newBlog) {
      const blogView = mapFromDbToViewModel(newBlog);
      res.status(201).json(blogView);
    }
  },
  async getBlogById(req: Request<{ id: ObjectId }>, res: Response) {
    const targetBlog = await blogsRepository.getBlogById(req.params.id);
    if (!targetBlog) {
      res.sendStatus(404);
      return;
    }
    const blogView = mapFromDbToViewModel(targetBlog);
    res.status(200).json(blogView);
  },
  async updateBlog(
    req: Request<{ id: ObjectId }, {}, BlogInputModel>,
    res: Response
  ) {
    const isUpdated = await blogsRepository.updateBlog(req.params.id, req.body);
    if (!isUpdated) {
      res.sendStatus(404);
      return;
    }
    res.sendStatus(204);
  },
  async deleteBlog(req: Request<{ id: ObjectId }>, res: Response) {
    const isDeleted = await blogsRepository.deleteBlog(req.params.id);
    if (!isDeleted) {
      res.sendStatus(404);
      return;
    }
    res.sendStatus(204);
  },
};
