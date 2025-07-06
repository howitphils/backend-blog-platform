import { ObjectId } from "mongodb";
import { PostDbType, PostInputModel } from "../types/posts-types";
import { ErrorWithStatusCode } from "../middlewares/error-handler";
import { HttpStatuses } from "../types/http-statuses";
import { PostsRepository } from "../db/mongodb/repositories/posts-repository/posts-db-repository";
import { BlogsService } from "./blogs-service";
import { inject, injectable } from "inversify";
import { PostsModel } from "../db/mongodb/repositories/posts-repository/post-entity";

@injectable()
export class PostsService {
  constructor(
    @inject(PostsRepository)
    private postsRepository: PostsRepository,

    @inject(BlogsService)
    private blogsService: BlogsService
  ) {}

  async createNewPost(post: PostInputModel): Promise<string> {
    const targetBlog = await this.blogsService.getBlogById(post.blogId);

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

    const dbPost = new PostsModel(newPost);

    return this.postsRepository.save(dbPost);
  }

  async getPostById(id: string): Promise<PostDbType> {
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

  async deletePost(id: string): Promise<boolean> {
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
