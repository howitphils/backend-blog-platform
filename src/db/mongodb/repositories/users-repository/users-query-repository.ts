import { usersCollection } from "../../mongodb";
import { PaginationType } from "../../../../types/blogs-types";
import {
  UserDbType,
  UsersMapedQueryType,
  UserViewModel,
} from "../../../../types/users-types";
import { ObjectId } from "mongodb";

export const usersQueryRepository = {
  // Получение всех постов с учетом query параметров
  async getAllUsers(
    filters: UsersMapedQueryType
  ): Promise<PaginationType<UserViewModel>> {
    const {
      pageNumber,
      pageSize,
      sortBy,
      sortDirection,
      searchEmailTerm,
      searchLoginTerm,
    } = filters;

    const createFilter = () => {
      const searchByEmail = searchEmailTerm
        ? { email: { $regex: searchEmailTerm } }
        : {};
      const searchByLogin = searchLoginTerm
        ? { login: { $regex: searchLoginTerm } }
        : {};
      return {
        ...searchByEmail,
        ...searchByLogin,
      };
    };

    // Получаем посты с учетом query параметров
    const users = await usersCollection
      .find(createFilter())
      .sort({ [sortBy]: sortDirection === "desc" ? -1 : 1 })
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize)
      .toArray();
    // Получаем число всех постов
    const totalCount = await usersCollection.countDocuments({});
    return {
      page: pageNumber,
      pagesCount: Math.ceil(totalCount / pageSize),
      pageSize: pageSize,
      totalCount,
      items: users.map(this.mapFromDbToViewModel),
    };
  },

  async getUserById(_id: ObjectId): Promise<UserViewModel | null> {
    const targetUser = await usersCollection.findOne({ _id });
    if (!targetUser) return null;
    return this.mapFromDbToViewModel(targetUser);
  },

  // Преобразование юзера из формата базы данных в формат, который ожидает клиент
  mapFromDbToViewModel(obj: UserDbType): UserViewModel {
    const { createdAt, email, login, _id } = obj;
    return {
      id: _id!.toString(),
      login: login,
      email: email,
      createdAt: createdAt,
    };
  },
};
