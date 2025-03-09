import { Request, Response } from "express";
import { PostInputModel } from "../types/posts-types";
import { postsRepository } from "../db/mongodb/repositories/posts-db-repository";

export const postsController = {
  getPosts: async (req: Request, res: Response) => {
    const posts = await postsRepository.getAllPosts();
    res.status(200).json(posts);
  },
  // createPost: (req: Request<{}, {}, PostInputModel>, res: Response) => {
  //   const newPost = postsRepository.createNewPost(req.body);
  //   res.status(201).json(newPost);
  // },
  // getPostById: (req: Request<{ id: string }>, res: Response) => {
  //   const targetPost = postsRepository.getPostById(req.params.id);
  //   if (!targetPost) {
  //     res.sendStatus(404);
  //     return;
  //   }
  //   res.status(200).json(targetPost);
  // },
  // updatePost: (
  //   req: Request<{ id: string }, {}, PostInputModel>,
  //   res: Response
  // ) => {
  //   const updatedPost = postsRepository.updatePost(req.params.id, req.body);
  //   if (!updatedPost) {
  //     res.sendStatus(404);
  //     return;
  //   }
  //   res.sendStatus(204);
  // },
  // deletePost: (req: Request<{ id: string }>, res: Response) => {
  //   const targetItem = postsRepository.deletePost(req.params.id);
  //   if (!targetItem) {
  //     res.sendStatus(404);
  //     return;
  //   }
  //   res.sendStatus(204);
  // },
};
