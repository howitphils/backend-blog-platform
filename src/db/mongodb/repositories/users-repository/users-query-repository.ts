import { usersCollection } from "../../mongodb";
import { PaginationType } from "../../../../types/blogs-types";
import {
  UserDbType,
  UsersMapedQueryType,
  UserViewModel,
} from "../../../../types/users-types";
import { ObjectId, WithId } from "mongodb";

export const usersQueryRepository = {
  // Получение всех юзеров с учетом query параметров
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

    // Cоздаем фильтр
    const createFilter = () => {
      return searchEmailTerm
        ? { email: { $regex: searchEmailTerm, $options: "i" } }
        : searchLoginTerm
        ? { login: { $regex: searchLoginTerm, $options: "i" } }
        : {};
    };

    // Получаем юзеров с учетом query параметров
    const users = await usersCollection
      .find(createFilter())
      .sort({ [sortBy]: sortDirection === "desc" ? -1 : 1 })
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize)
      .toArray();

    // Получаем число всех юзеров
    const totalCount = await usersCollection.countDocuments();

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
  mapFromDbToViewModel(user: WithId<UserDbType>): UserViewModel {
    const { createdAt, email, login, _id } = user;
    return {
      id: _id!.toString(),
      login: login,
      email: email,
      createdAt: createdAt,
    };
  },
};
