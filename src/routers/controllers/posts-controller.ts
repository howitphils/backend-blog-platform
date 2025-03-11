import { Request, Response } from "express";
import { ObjectId } from "mongodb";
import { PostInputModel } from "../../types/posts-types";
import { mapFromDbToViewModel } from "./utils";
import { postsRepository } from "../../db/mongodb/repositories/posts-db-repository";

export const postsController = {
  async getPosts(req: Request, res: Response) {
    const posts = await postsRepository.getAllPosts();
    const postsView = posts.map(mapFromDbToViewModel);
    res.status(200).json(postsView);
  },
  async createPost(req: Request<{}, {}, PostInputModel>, res: Response) {
    const createdId = await postsRepository.createNewPost(req.body);
    const newPost = await postsRepository.getPostById(createdId);
    if (newPost) {
      const postView = mapFromDbToViewModel(newPost);
      res.status(201).json(postView);
    }
  },
  async getPostById(req: Request<{ id: ObjectId }>, res: Response) {
    const targetPost = await postsRepository.getPostById(req.params.id);
    if (!targetPost) {
      res.sendStatus(404);
      return;
    }
    const postView = mapFromDbToViewModel(targetPost);
    res.status(200).json(postView);
  },
  async updatePost(
    req: Request<{ id: ObjectId }, {}, PostInputModel>,
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
  async deletePost(req: Request<{ id: ObjectId }>, res: Response) {
    const targetItem = await postsRepository.deletePost(req.params.id);
    if (!targetItem) {
      res.sendStatus(404);
      return;
    }
    res.sendStatus(204);
  },
};
