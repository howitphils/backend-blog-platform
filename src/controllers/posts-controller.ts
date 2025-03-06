import { Request, Response } from "express";
import { postsRepository } from "../db/repositories/posts-repository";
import { PostInputModel } from "../types/posts-types";
export const postsController = {
  getPosts: (req: Request, res: Response) => {
    const posts = postsRepository.getAllPosts();
    res.status(200).json(posts);
  },
  createPost: (req: Request<{}, {}, PostInputModel>, res: Response) => {
    const newPost = postsRepository.createNewPost(req.body);
    res.status(201).json(newPost);
  },
  getPostById: (req: Request<{ id: string }>, res: Response) => {
    const targetPost = postsRepository.getPostById(req.params.id);
    if (!targetPost) {
      res.sendStatus(404);
      return;
    }
    res.status(200).json(targetPost);
  },
  updatePost: (
    req: Request<{ id: string }, {}, PostInputModel>,
    res: Response
  ) => {
    const updatedPost = postsRepository.updatePost(req.params.id, req.body);
    if (!updatedPost) {
      res.sendStatus(404);
      return;
    }
    res.sendStatus(204);
  },
  deletePost: (req: Request<{ id: string }>, res: Response) => {
    const targetItem = postsRepository.deletePost(req.params.id);
    if (!targetItem) {
      res.sendStatus(404);
      return;
    }
    res.sendStatus(204);
  },
};
