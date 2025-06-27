import { commentsCollection } from "../../mongodb";
import { ObjectId, WithId } from "mongodb";
import {
  CommentDbType,
  CommentsMapedQueryType,
  CommentViewModel,
} from "../../../../types/comments-types";
import { PaginationType } from "../../../../types/common-types";

export class CommentsQueryRepository {
  // Получение всех комментариев с учетом query параметров
  async getAllCommentsForPost(
    filters: CommentsMapedQueryType,
    postId: string
  ): Promise<PaginationType<CommentViewModel>> {
    const { pageNumber, pageSize, sortBy, sortDirection } = filters;

    // Получаем посты с учетом query параметров
    const comments = await commentsCollection
      .find({ postId })
      .sort({ [sortBy]: sortDirection === "desc" ? -1 : 1 })
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize)
      .toArray();

    // Получаем число всех постов
    const totalCount = await commentsCollection.countDocuments({ postId });

    return {
      page: pageNumber,
      pagesCount: Math.ceil(totalCount / pageSize),
      pageSize: pageSize,
      totalCount,
      items: comments.map(this._mapFromDbToViewModel),
    };
  }

  async getCommentById(_id: ObjectId): Promise<CommentViewModel | null> {
    const targetComment = await commentsCollection.findOne({ _id });
    if (!targetComment) return null;
    return this._mapFromDbToViewModel(targetComment);
  }

  // Преобразование комментарий из формата базы данных в формат, который ожидает клиент
  _mapFromDbToViewModel(comment: WithId<CommentDbType>): CommentViewModel {
    const { _id, commentatorInfo, content, createdAt } = comment;
    return {
      id: _id!.toString(),
      commentatorInfo,
      content,
      createdAt,
    };
  }
}
