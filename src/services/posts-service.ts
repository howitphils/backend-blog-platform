import { ObjectId } from "mongodb";
import { PostDbType, PostInputModel } from "../types/posts-types";
import { ErrorWithStatusCode } from "../middlewares/error-handler";
import { HttpStatuses } from "../types/http-statuses";
import { PostsRepository } from "../db/mongodb/repositories/posts-repository/posts-db-repository";
import { BlogsService } from "./blogs-service";

export class PostsService {
  constructor(
    public postsRepository: PostsRepository,
    public blogsService: BlogsService
  ) {}

  async createNewPost(post: PostInputModel): Promise<ObjectId> {
    const targetBlog = await this.blogsService.getBlogById(
      new ObjectId(post.blogId)
    );

    if (!targetBlog) {
      throw new ErrorWithStatusCode(
        "Blog does not exist",
        HttpStatuses.NotFound
      );
    }

    const newPost: PostDbType = {
      blogId: post.blogId,
      content: post.content,
      shortDescription: post.shortDescription,
      title: post.title,
      blogName: targetBlog.name,
      createdAt: new Date().toISOString(),
    };

    return this.postsRepository.createNewPost(newPost);
  }

  async getPostById(id: ObjectId): Promise<PostDbType> {
    const post = await this.postsRepository.getPostById(id);
    if (!post) {
      throw new ErrorWithStatusCode(
        "Post does not exist",
        HttpStatuses.NotFound
      );
    }
    return post;
  }

  async updatePost(
    id: ObjectId,
    updatedPost: PostInputModel
  ): Promise<boolean> {
    const targetPost = await this.postsRepository.getPostById(id);

    if (!targetPost) {
      throw new ErrorWithStatusCode(
        "Post does not exist",
        HttpStatuses.NotFound
      );
    }

    return this.postsRepository.updatePost(id, updatedPost);
  }

  async deletePost(id: ObjectId): Promise<boolean> {
    const targetPost = await this.postsRepository.getPostById(id);

    if (!targetPost) {
      throw new ErrorWithStatusCode(
        "Post does not exist",
        HttpStatuses.NotFound
      );
    }

    return this.postsRepository.deletePost(id);
  }
}
