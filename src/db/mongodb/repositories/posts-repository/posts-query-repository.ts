import { ObjectId, WithId } from "mongodb";
import {
  PostDbType,
  PostsMapedQueryType,
  PostViewModel,
} from "../../../../types/posts-types";
import { PaginationType } from "../../../../types/common-types";
import { PostsModel } from "./post-entity";

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

  async getPostById(_id: ObjectId): Promise<PostViewModel | null> {
    // Получаем пост по id
    const post = await PostsModel.findById(_id);
    // Если пост не найден, возвращаем null
    if (!post) {
      return null;
    }
    // Если пост найден, преобразуем его в формат, который ожидает клиент
    return this._mapFromDbToViewModel(post);
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
