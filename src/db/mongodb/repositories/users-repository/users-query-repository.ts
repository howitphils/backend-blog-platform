import { usersCollection } from "../../mongodb";
import {
  MeModel,
  UserDbType,
  UsersMapedQueryType,
  UserViewModel,
} from "../../../../types/users-types";
import { ObjectId, WithId } from "mongodb";
import { PaginationType } from "../../../../types/common-types";

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
      if (searchEmailTerm && searchLoginTerm) {
        return {
          $or: [
            {
              email: { $regex: searchEmailTerm, $options: "i" },
            },
            {
              login: { $regex: searchLoginTerm, $options: "i" },
            },
          ],
        };
      } else if (searchEmailTerm) {
        return { email: { $regex: searchEmailTerm, $options: "i" } };
      } else if (searchLoginTerm) {
        return { login: { $regex: searchLoginTerm, $options: "i" } };
      } else {
        return {};
      }
    };

    // Получаем юзеров с учетом query параметров
    const users = await usersCollection
      .find(createFilter())
      .sort({ [sortBy]: sortDirection === "desc" ? -1 : 1 })
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize)
      .toArray();

    // Получаем число всех юзеров
    const totalCount = await usersCollection.countDocuments(createFilter());

    return {
      page: pageNumber,
      pagesCount: Math.ceil(totalCount / pageSize),
      pageSize: pageSize,
      totalCount,
      items: users.map(this._mapFromDbToViewModel),
    };
  },

  async getUserById(_id: ObjectId): Promise<UserViewModel | null> {
    const targetUser = await usersCollection.findOne({ _id });
    if (!targetUser) return null;

    return this._mapFromDbToViewModel(targetUser);
  },

  async getMyInfo(_id: ObjectId): Promise<MeModel | null> {
    const targetUser = await usersCollection.findOne({ _id });
    if (!targetUser) return null;

    return this._createMeModel(targetUser);
  },

  // Преобразование юзера из формата базы данных в формат, который ожидает клиент
  _mapFromDbToViewModel(user: WithId<UserDbType>): UserViewModel {
    const { createdAt, email, login, _id } = user;
    return {
      id: _id!.toString(),
      login: login,
      email: email,
      createdAt: createdAt,
    };
  },
  _createMeModel(user: WithId<UserDbType>): MeModel {
    return {
      userId: user._id.toString(),
      email: user.email,
      login: user.login,
    };
  },
};
