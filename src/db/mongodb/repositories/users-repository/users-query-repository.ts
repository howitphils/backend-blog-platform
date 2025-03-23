import { ObjectId } from "mongodb";
import {
  PostDbType,
  PostsMapedQueryType,
  PostViewModel,
} from "../../../../types/posts-types";
import { postsCollection } from "../../mongodb";
import { PaginationType } from "../../../../types/blogs-types";
import {
  UsersMapedQueryType,
  UserViewModel,
} from "../../../../types/users-types";

export const usersQueryRepository = {
  // Получение всех постов с учетом query параметров
  async getAllUsers(
    filters: UsersMapedQueryType
  ): Promise<PaginationType<UserViewModel>> {
    // const { pageNumber, pageSize, sortBy, sortDirection } = filters;
    // // Получаем посты с учетом query параметров
    // const posts = await postsCollection
    //   .find({})
    //   .sort({ [sortBy]: sortDirection === "desc" ? -1 : 1 })
    //   .skip((pageNumber - 1) * pageSize)
    //   .limit(pageSize)
    //   .toArray();
    // // Получаем число всех постов
    // const totalCount = await postsCollection.countDocuments();
    // return {
    //   page: pageNumber,
    //   pagesCount: Math.ceil(totalCount / pageSize),
    //   pageSize: pageSize,
    //   totalCount,
    //   items: posts.map(this.mapFromDbToViewModel),
    // };
  },

  // Преобразование поста из формата базы данных в формат, который ожидает клиент
  mapFromDbToViewModel(obj: PostDbType): PostViewModel {
    const { _id, ...rest } = obj;
    return { ...rest, id: _id!.toString() };
  },
};
