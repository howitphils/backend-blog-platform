import { commentsCollection, usersCollection } from "../../mongodb";
import { PaginationType } from "../../../../types/blogs-types";
import {
  UserDbType,
  UsersMapedQueryType,
  UserViewModel,
} from "../../../../types/users-types";
import { ObjectId, WithId } from "mongodb";
import {
  CommentDbModel,
  CommentViewModel,
} from "../../../../types/comments-types";

export const commentsQueryRepository = {
  // Получение всех юзеров с учетом query параметров
  // async getAllUsers(
  //   filters: UsersMapedQueryType
  // ): Promise<PaginationType<UserViewModel>> {
  //   const {
  //     pageNumber,
  //     pageSize,
  //     sortBy,
  //     sortDirection,
  //     searchEmailTerm,
  //     searchLoginTerm,
  //   } = filters;

  //   // Cоздаем фильтр
  //   const createFilter = () => {
  //     if (searchEmailTerm && searchLoginTerm) {
  //       return {
  //         $or: [
  //           {
  //             email: { $regex: searchEmailTerm, $options: "i" },
  //           },
  //           {
  //             login: { $regex: searchLoginTerm, $options: "i" },
  //           },
  //         ],
  //       };
  //     } else if (searchEmailTerm) {
  //       return { email: { $regex: searchEmailTerm, $options: "i" } };
  //     } else if (searchLoginTerm) {
  //       return { login: { $regex: searchLoginTerm, $options: "i" } };
  //     } else {
  //       return {};
  //     }
  //   };

  //   // Получаем юзеров с учетом query параметров
  //   const users = await usersCollection
  //     .find(createFilter())
  //     .sort({ [sortBy]: sortDirection === "desc" ? -1 : 1 })
  //     .skip((pageNumber - 1) * pageSize)
  //     .limit(pageSize)
  //     .toArray();

  //   // Получаем число всех юзеров
  //   const totalCount = await usersCollection.countDocuments(createFilter());

  //   return {
  //     page: pageNumber,
  //     pagesCount: Math.ceil(totalCount / pageSize),
  //     pageSize: pageSize,
  //     totalCount,
  //     items: users.map(this._mapFromDbToViewModel),
  //   };
  // },

  async getCommentById(_id: ObjectId): Promise<CommentViewModel | null> {
    const targetComment = await commentsCollection.findOne({ _id });
    if (!targetComment) return null;
    return this._mapFromDbToViewModel(targetComment);
  },

  // Преобразование юзера из формата базы данных в формат, который ожидает клиент
  _mapFromDbToViewModel(comment: WithId<CommentDbModel>): CommentViewModel {
    const { _id, commentatorInfo, content, createdAt } = comment;
    return {
      id: _id!.toString(),
      commentatorInfo,
      content,
      createdAt,
    };
  },
};
