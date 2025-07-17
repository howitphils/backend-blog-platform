import {
  MeModel,
  UsersMapedQueryType,
  UserViewModel,
} from "../../../../types/users-types";
import { PaginationType } from "../../../../types/common-types";
import { UserModel } from "./user-entitty";
import { UserDbDocumentType } from "./user-entity-types";

export class UsersQueryRepository {
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

    // Получаем юзеров с учётом query параметров
    const users = await UserModel.find(createFilter())
      .sort({ [sortBy]: sortDirection === "desc" ? -1 : 1 })
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize);

    // Получаем число всех юзеров
    const totalCount = await UserModel.countDocuments(createFilter());

    return {
      page: pageNumber,
      pagesCount: Math.ceil(totalCount / pageSize),
      pageSize: pageSize,
      totalCount,
      items: users.map(this._mapFromDbToViewModel),
    };
  }

  async getUserById(id: string): Promise<UserViewModel | null> {
    const targetUser = await UserModel.findById(id);
    if (!targetUser) return null;

    return this._mapFromDbToViewModel(targetUser);
  }

  async getMyInfo(id: string): Promise<MeModel | null> {
    const targetUser = await UserModel.findById(id);
    if (!targetUser) return null;

    return this._createMeModel(targetUser);
  }

  // Преобразование юзера из формата базы данных в формат, который ожидает клиент
  _mapFromDbToViewModel(user: UserDbDocumentType): UserViewModel {
    const { createdAt, email, login } = user.accountData;
    return {
      id: user.id,
      login: login,
      email: email,
      createdAt: createdAt,
    };
  }

  _createMeModel(user: UserDbDocumentType): MeModel {
    return {
      userId: user.id,
      email: user.accountData.email,
      login: user.accountData.login,
    };
  }
}
