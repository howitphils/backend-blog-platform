import { PostInputModel } from "../types/posts-types";
import { ErrorWithStatusCode } from "../middlewares/error-handler";
import { HttpStatuses } from "../types/http-statuses";
import { PostsRepository } from "../db/mongodb/repositories/posts-repository/posts-db-repository";
import { BlogsService } from "./blogs-service";
import { inject, injectable } from "inversify";
import {
  Post,
  PostDbDocument,
  PostsModel,
} from "../db/mongodb/repositories/posts-repository/post-entity";
import { APP_CONFIG } from "../settings";

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
        APP_CONFIG.ERROR_MESSAGES.BLOG_NOT_FOUND,
        HttpStatuses.NotFound
      );
    }

    const { blogId, content, shortDescription, title } = post;

    const newPost: Post = new Post(
      title,
      shortDescription,
      content,
      blogId,
      targetBlog.name
    );

    const dbPost = new PostsModel(newPost);

    return this.postsRepository.save(dbPost);
  }

  async getPostById(id: string): Promise<PostDbDocument> {
    const post = await this.postsRepository.getPostById(id);

    if (!post) {
      throw new ErrorWithStatusCode(
        APP_CONFIG.ERROR_MESSAGES.POST_NOT_FOUND,
        HttpStatuses.NotFound
      );
    }
    return post;
  }

  async updatePost(id: string, updatedPost: PostInputModel): Promise<void> {
    const post = await this.postsRepository.getPostById(id);

    if (!post) {
      throw new ErrorWithStatusCode(
        APP_CONFIG.ERROR_MESSAGES.POST_NOT_FOUND,
        HttpStatuses.NotFound
      );
    }

    post.title = updatedPost.title;
    post.content = updatedPost.content;
    post.shortDescription = updatedPost.shortDescription;

    await this.postsRepository.save(post);
  }

  async deletePost(id: string): Promise<void> {
    const post = await this.postsRepository.getPostById(id);

    if (!post) {
      throw new ErrorWithStatusCode(
        APP_CONFIG.ERROR_MESSAGES.POST_NOT_FOUND,
        HttpStatuses.NotFound
      );
    }

    await post.deleteOne();
  }
}
