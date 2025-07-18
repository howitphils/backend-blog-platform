import {
  PostInputModel,
  UpdatePostLikeStatusDtoType,
} from "../types/posts-types";
import { ErrorWithStatusCode } from "../middlewares/error-handler";
import { HttpStatuses } from "../types/http-statuses";
import { PostsRepository } from "../db/mongodb/repositories/posts-repository/posts-db-repository";
import { BlogsService } from "./blogs-service";
import { inject, injectable } from "inversify";
import { PostEntity } from "../db/mongodb/repositories/posts-repository/post-entity";
import { APP_CONFIG } from "../settings";
import { PostLikesRepository } from "../db/mongodb/repositories/likes-repository/post-likes/post-like-repository";
import { PostLikeEntity } from "../db/mongodb/repositories/likes-repository/post-likes/post-like-entity";
import { LikeStatuses } from "../types/common-types";
import { UsersRepository } from "../db/mongodb/repositories/users-repository/users-db-repository";
import { PostDbDocumentType } from "../db/mongodb/repositories/posts-repository/post-entity-types";

@injectable()
export class PostsService {
  constructor(
    @inject(PostsRepository)
    private postsRepository: PostsRepository,

    @inject(BlogsService)
    private blogsService: BlogsService,

    @inject(PostLikesRepository)
    private postLikesRepository: PostLikesRepository,

    @inject(UsersRepository)
    private userRepository: UsersRepository
  ) {}

  async createNewPost(dto: PostInputModel): Promise<string> {
    const targetBlog = await this.blogsService.getBlogById(dto.blogId);

    if (!targetBlog) {
      throw new ErrorWithStatusCode(
        APP_CONFIG.ERROR_MESSAGES.BLOG_NOT_FOUND,
        HttpStatuses.NotFound
      );
    }

    const { blogId, content, shortDescription, title } = dto;

    const dbPost = PostEntity.createPost({
      blogId,
      blogName: targetBlog.name,
      content,
      shortDescription,
      title,
    });

    return this.postsRepository.save(dbPost);
  }

  async getPostById(id: string): Promise<PostDbDocumentType> {
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

    post.updatePost(updatedPost);

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

  async updatePostLikeStatus(dto: UpdatePostLikeStatusDtoType) {
    const targetPost = await this.postsRepository.getPostById(dto.postId);

    if (!targetPost) {
      throw new ErrorWithStatusCode(
        APP_CONFIG.ERROR_MESSAGES.POST_NOT_FOUND,
        HttpStatuses.NotFound
      );
    }

    const targetLike =
      await this.postLikesRepository.getPostLikeByUserIdAndPostId({
        userId: dto.userId,
        postId: dto.postId,
      });

    if (!targetLike) {
      const currentUser = await this.userRepository.getUserById(dto.userId);

      if (!currentUser) {
        throw new Error("User not found in update post like");
      }

      const newLike = PostLikeEntity.createPostLike({
        userId: dto.userId,
        postId: dto.postId,
        likeStatus: dto.likeStatus,
        login: currentUser.accountData.login,
      });

      await this.postLikesRepository.save(newLike);

      if (dto.likeStatus === LikeStatuses.Like) {
        targetPost.increaseLikesCount();

        const newestLikes = await this.postLikesRepository.getNewestLikes(
          targetPost.id
        );

        targetPost.updateNewestLikes(newestLikes);
      } else if (dto.likeStatus === LikeStatuses.Dislike) {
        targetPost.increaseDislikesCount();
      }

      await this.postsRepository.save(targetPost);

      return;
    }

    // Если статус лайка не равен статусу лайка в запросе, то обновляем счетчики лайков и дизлайков
    if (dto.likeStatus !== targetLike.status) {
      // Если статус лайка в запросе - None, то убираем лайк или дизлайк
      if (dto.likeStatus === LikeStatuses.None) {
        if (targetLike.status === LikeStatuses.Like) {
          // Если текущий статус лайка - лайк, то убираем лайк
          targetPost.decreaseLikesCount();
        } else if (targetLike.status === LikeStatuses.Dislike) {
          // Если текущий статус лайка - дизлайк, то убираем дизлайк
          targetPost.decreaseDislikesCount();
        }
      }

      if (dto.likeStatus === LikeStatuses.Like) {
        if (targetLike.status === LikeStatuses.Dislike) {
          // Если текущий статус лайка - дизлайк, то убираем дизлайк
          targetPost.decreaseDislikesCount();
        }
        // Если текущий статус лайка - None, то просто добавляем лайк
        targetPost.increaseLikesCount();
      }

      if (dto.likeStatus === LikeStatuses.Dislike) {
        if (targetLike.status === LikeStatuses.Like) {
          // Если текущий статус лайка - лайк, то убираем лайк
          targetPost.decreaseLikesCount();
        }
        // Если текущий статус лайка - None, то просто добавляем дизлайк
        targetPost.increaseDislikesCount();
      }

      if (targetPost.likesCount < 0) {
        targetPost.resetLikesCount();
      } else if (targetPost.dislikesCount < 0) {
        targetPost.resetDislikesCount();
      }
      // Обновляем статус лайка
      targetLike.updateStatus(dto.likeStatus);

      await this.postLikesRepository.save(targetLike);

      const newestLikes = await this.postLikesRepository.getNewestLikes(
        targetPost.id
      );
      targetPost.updateNewestLikes(newestLikes);

      await this.postsRepository.save(targetPost);
    }
  }
}
