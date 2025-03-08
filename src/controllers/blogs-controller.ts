import { Request, Response } from "express";
import { BlogInputModel } from "../types/blogs-types";
import { blogsRepository } from "../db/mongodb/repositories/blogs-db-repository";

export const blogsController = {
  getBlogs: async (req: Request, res: Response) => {
    const blogs = await blogsRepository.getAllBlogs();
    res.status(200).json(blogs);
  },
  createBlog: async (req: Request<{}, {}, BlogInputModel>, res: Response) => {
    const newBlog = await blogsRepository.createNewBlog(req.body);
    res.status(201).json(newBlog);
  },
  // getBlogById: (req: Request<{ id: string }>, res: Response) => {
  //   const targetBlog = blogsRepository.getBlogById(req.params.id);
  //   if (!targetBlog) {
  //     res.sendStatus(404);
  //     return;
  //   }
  //   res.status(200).json(targetBlog);
  // },
  // updateBlog: (
  //   req: Request<{ id: string }, {}, BlogInputModel>,
  //   res: Response
  // ) => {
  //   const updatedBlog = blogsRepository.updateBlog(req.params.id, req.body);
  //   if (!updatedBlog) {
  //     res.sendStatus(404);
  //     return;
  //   }
  //   res.sendStatus(204);
  // },
  // deleteBlog: (req: Request<{ id: string }>, res: Response) => {
  //   const targetItem = blogsRepository.deleteBlog(req.params.id);
  //   if (!targetItem) {
  //     res.sendStatus(404);
  //     return;
  //   }
  //   res.sendStatus(204);
  // },
};
