import {
  NewestLikeType,
  PostsMapedQueryType,
  PostViewModel,
} from "../../../../types/posts-types";
import {
  LikesStatusesObjType,
  LikeStatuses,
  PaginationType,
} from "../../../../types/common-types";
import { PostModel } from "./post-entity";
import { PostLikeModel } from "../likes-repository/post-likes/post-like-entity";
import { PostLikeDbDocumentType } from "../likes-repository/post-likes/post-like-entity-types";

export class PostsQueryRepository {
  // Получение всех постов с учетом query параметров
  async getAllPosts(
    filters: PostsMapedQueryType,
    userId: string,
    blogId?: string
  ): Promise<PaginationType<PostViewModel>> {
    const { pageNumber, pageSize, sortBy, sortDirection } = filters;

    const filter = blogId ? { blogId } : {};

    // Получаем посты с учетом query параметров
    const posts = await PostModel.find(filter)
      .sort({ [sortBy]: sortDirection === "desc" ? -1 : 1 })
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize);

    // Получаем число всех постов
    const totalCount = await PostModel.countDocuments(filter);

    let likesStatusesObj: LikesStatusesObjType = {};

    if (userId) {
      const postsIds = posts.map((post) => post.id);

      // Получаем лайки юзера для найденных постов
      const likes = await PostLikeModel.find({
        postId: { $in: postsIds },
        userId,
      }).lean();

      // Преобразуем в объект формата postId: likeStatus для более быстрого считывания
      likesStatusesObj = likes.reduce((acc: LikesStatusesObjType, like) => {
        acc[like.postId] = like.status;
        return acc;
      }, {});
    }

    return {
      page: pageNumber,
      pagesCount: Math.ceil(totalCount / pageSize),
      pageSize: pageSize,
      totalCount,
      items: posts.map((post) => {
        return {
          id: post.id,
          blogId: post.blogId,
          blogName: post.blogName,
          content: post.content,
          createdAt: post.createdAt,
          shortDescription: post.shortDescription,
          title: post.title,
          extendedLikesInfo: {
            dislikesCount: post.dislikesCount,
            likesCount: post.likesCount,
            myStatus: likesStatusesObj[post.id] || LikeStatuses.None,
            newestLikes: post.newestLikes.map(this._mapDbNewestLikeToView),
          },
        };
      }),
    };
  }

  async getPostById(id: string, userId: string): Promise<PostViewModel | null> {
    // Получаем пост по id
    const post = await PostModel.findById(id);
    // Если пост не найден, возвращаем null
    if (!post) {
      return null;
    }

    let postLike: PostLikeDbDocumentType | null = null;

    // Получаем лайк для поста конкретного юзера
    if (userId) {
      postLike = await PostLikeModel.findOne({
        postId: post.id,
        userId,
      });
    }

    // Преобразуем последние лайки в формат, который ожидает клиент
    const mapedNewestLikes = post.newestLikes.map(this._mapDbNewestLikeToView);

    return {
      id: post._id.toString(),
      blogId: post.blogId,
      blogName: post.blogName,
      content: post.content,
      createdAt: post.createdAt,
      shortDescription: post.shortDescription,
      title: post.title,
      extendedLikesInfo: {
        likesCount: post.likesCount,
        dislikesCount: post.dislikesCount,
        myStatus: postLike ? postLike.status : LikeStatuses.None,
        newestLikes: mapedNewestLikes,
      },
    };
  }

  _mapDbNewestLikeToView(dbLike: PostLikeDbDocumentType): NewestLikeType {
    return {
      addedAt: dbLike.addedAt,
      login: dbLike.login,
      userId: dbLike.userId,
    };
  }
}
