import {
  PostsMapedQueryType,
  PostViewModel,
} from "../../../../types/posts-types";
import { LikeStatuses, PaginationType } from "../../../../types/common-types";
import { PostsModel } from "./post-entity";
import { PostLikesModel } from "../likes-repository/post-likes/post-like-entity";

export class PostsQueryRepository {
  // Получение всех постов с учетом query параметров
  async getAllPosts(
    filters: PostsMapedQueryType
  ): Promise<PaginationType<PostViewModel>> {
    const { pageNumber, pageSize, sortBy, sortDirection } = filters;

    // Получаем посты с учетом query параметров
    const posts = await PostsModel.find({})
      .sort({ [sortBy]: sortDirection === "desc" ? -1 : 1 })
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize)
      .lean();

    // Получаем число всех постов
    const totalCount = await PostsModel.countDocuments();

    return {
      page: pageNumber,
      pagesCount: Math.ceil(totalCount / pageSize),
      pageSize: pageSize,
      totalCount,
      items: posts.map(this._mapFromDbToViewModel),
    };
  }

  // Получение постов конкретного блога
  async getAllPostsByBlogId(
    blogId: string,
    filters: PostsMapedQueryType
  ): Promise<PaginationType<PostViewModel>> {
    const { pageNumber, pageSize, sortBy, sortDirection } = filters;

    // Получаем посты конкретного блога с учетом query параметров и айди блога
    const posts = await PostsModel.find({ blogId })
      .sort({ [sortBy]: sortDirection === "desc" ? -1 : 1 })
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize)
      .lean();

    // Получаем число постов конкретного блога
    const totalCount = await PostsModel.countDocuments({
      blogId,
    });

    return {
      page: pageNumber,
      pagesCount: Math.ceil(totalCount / pageSize),
      pageSize: pageSize,
      totalCount,
      items: posts.map(this._mapFromDbToViewModel),
    };
  }

  async getPostById(id: string, userId: string): Promise<PostViewModel | null> {
    // Получаем пост по id
    const post = await PostsModel.findById(id);
    // Если пост не найден, возвращаем null
    if (!post) {
      return null;
    }

    // Получаем лайк для поста конкретного юзера
    const postLike = userId
      ? await PostLikesModel.findOne({
          postId: post.id,
          userId,
        })
      : {};

    // Преобразуем последние лайки в формат, который ожидает клиент
    const mapedNewestLikes = post.newestLikes.map((like) => ({
      addedAt: like.createdAt,
      userId: like.userId,
      login: like.userLogin,
    }));

    // Если пост найден, преобразуем его в формат, который ожидает клиент
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
        myStatus: postLike?.status || LikeStatuses.None,
        newestLikes: mapedNewestLikes,
      },
    };
  }

  // Преобразование поста из формата базы данных в формат, который ожидает клиент
  _mapFromDbToViewModel(post: WithId<PostDbType>): PostViewModel {
    return {
      id: post._id.toString(),
      blogId: post.blogId,
      blogName: post.blogName,
      content: post.content,
      createdAt: post.createdAt,
      shortDescription: post.shortDescription,
      title: post.title,
    };
  }
}
