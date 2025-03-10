import { Request, Response } from "express";
import { PostInputModel } from "../types/posts-types";
import { postsRepository } from "../db/mongodb/repositories/posts-db-repository";

export const postsController = {
  async getPosts(req: Request, res: Response) {
    const posts = await postsRepository.getAllPosts();
    res.status(200).json(posts);
  },
  async createPost(req: Request<{}, {}, PostInputModel>, res: Response) {
    const newPost = await postsRepository.createNewPost(req.body);
    res.status(201).json(newPost);
  },
  async getPostById(req: Request<{ id: string }>, res: Response) {
    const targetPost = await postsRepository.getPostById(req.params.id);
    if (!targetPost) {
      res.sendStatus(404);
      return;
    }
    res.status(200).json(targetPost);
  },
  async updatePost(
    req: Request<{ id: string }, {}, PostInputModel>,
    res: Response
  ) {
    const updatedPost = await postsRepository.updatePost(
      req.params.id,
      req.body
    );
    if (!updatedPost) {
      res.sendStatus(404);
      return;
    }
    res.sendStatus(204);
  },
  async deletePost(req: Request<{ id: string }>, res: Response) {
    const targetItem = await postsRepository.deletePost(req.params.id);
    if (!targetItem) {
      res.sendStatus(404);
      return;
    }
    res.sendStatus(204);
  },
};
