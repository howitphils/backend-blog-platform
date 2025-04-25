import { ObjectId } from "mongodb";
import { postsRepository } from "../db/mongodb/repositories/posts-repository/posts-db-repository";
import { PostDbType, PostInputModel } from "../types/posts-types";
import { blogsService } from "./blogs-service";
import { CustomError } from "../middlewares/error-handler";
import { HttpStatuses } from "../types/http-statuses";

export const postsService = {
  async createNewPost(post: PostInputModel): Promise<ObjectId> {
    const targetBlog = await blogsService.getBlogById(
      new ObjectId(post.blogId)
    );

    if (!targetBlog) {
      throw new CustomError("Blog does not exist", HttpStatuses.NotFound);
    }

    const newPost: PostDbType = {
      blogId: post.blogId,
      content: post.content,
      shortDescription: post.shortDescription,
      title: post.title,
      blogName: targetBlog.name,
      createdAt: new Date().toISOString(),
    };

    return postsRepository.createNewPost(newPost);
  },

  async getPostById(id: ObjectId): Promise<PostDbType> {
    const post = await postsRepository.getPostById(id);
    if (!post) {
      throw new CustomError("Post does not exist", HttpStatuses.NotFound);
    }
    return post;
  },

  async updatePost(
    id: ObjectId,
    updatedPost: PostInputModel
  ): Promise<boolean> {
    const targetPost = await postsRepository.getPostById(id);

    if (!targetPost) {
      throw new CustomError("Post does not exist", HttpStatuses.NotFound);
    }

    return postsRepository.updatePost(id, updatedPost);
  },

  async deletePost(id: ObjectId): Promise<boolean> {
    const targetPost = await postsRepository.getPostById(id);

    if (!targetPost) {
      throw new CustomError("Post does not exist", HttpStatuses.NotFound);
    }

    return postsRepository.deletePost(id);
  },
};
