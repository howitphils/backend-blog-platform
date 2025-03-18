import { Request, Response } from "express";
import { ObjectId } from "mongodb";
import { PostInputModel, PostsRequestQueryType } from "../../types/posts-types";
import { mapPostsQueryParams } from "./utils";
import { postsQueryRepository } from "../../db/mongodb/repositories/posts-repository/posts-query-repository";
import { postsService } from "../../services/posts-service";

export const postsController = {
  async getPosts(
    req: Request<{}, {}, {}, PostsRequestQueryType>,
    res: Response
  ) {
    const mapedQueryParams = mapPostsQueryParams(req.query);
    const posts = await postsQueryRepository.getAllPosts(mapedQueryParams);

    res.status(200).json(posts);
  },
  async createPost(req: Request<{}, {}, PostInputModel>, res: Response) {
    const createdId = await postsService.createNewPost(req.body);
    const newPost = await postsQueryRepository.getPostById(createdId);
    res.status(201).json(newPost);
  },
  async getPostById(req: Request<{ id: ObjectId }>, res: Response) {
    const targetPost = await postsQueryRepository.getPostById(req.params.id);
    if (!targetPost) {
      res.sendStatus(404);
      return;
    }
    res.status(200).json(targetPost);
  },
  async updatePost(
    req: Request<{ id: ObjectId }, {}, PostInputModel>,
    res: Response
  ) {
    const isUpdated = await postsService.updatePost(req.params.id, req.body);
    if (!isUpdated) {
      res.sendStatus(404);
      return;
    }
    res.sendStatus(204);
  },
  async deletePost(req: Request<{ id: ObjectId }>, res: Response) {
    const isDeleted = await postsService.deletePost(req.params.id);
    if (!isDeleted) {
      res.sendStatus(404);
      return;
    }
    res.sendStatus(204);
  },
};
