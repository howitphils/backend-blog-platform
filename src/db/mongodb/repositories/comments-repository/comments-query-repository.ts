import {
  CommentsMapedQueryType,
  CommentViewModel,
} from "../../../../types/comments-types";
import { PaginationType } from "../../../../types/common-types";
import { CommentDbDocument, CommentsModel } from "./comments-entity";

export class CommentsQueryRepository {
  // Получение всех комментариев с учетом query параметров
  async getAllCommentsForPost(
    filters: CommentsMapedQueryType,
    postId: string
  ): Promise<PaginationType<CommentViewModel>> {
    const { pageNumber, pageSize, sortBy, sortDirection } = filters;

    // Получаем посты с учетом query параметров
    const comments = await CommentsModel.find({ postId })
      .sort({ [sortBy]: sortDirection === "desc" ? -1 : 1 })
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize);

    // Получаем число всех комментов конкретного поста
    const totalCount = await CommentsModel.countDocuments({ postId });

    return {
      page: pageNumber,
      pagesCount: Math.ceil(totalCount / pageSize),
      pageSize: pageSize,
      totalCount,
      items: comments.map(this._mapFromDbToViewModel),
    };
  }

  async getCommentById(id: string): Promise<CommentViewModel | null> {
    const targetComment = await CommentsModel.findById(id);

    if (!targetComment) return null;

    return this._mapFromDbToViewModel(targetComment);
  }

  // Преобразование комментария из формата бд в формат, который ожидает клиент
  _mapFromDbToViewModel(comment: CommentDbDocument): CommentViewModel {
    const { id, content, createdAt } = comment;
    const { userId, userLogin } = comment.commentatorInfo;

    return {
      id,
      content,
      createdAt,
      commentatorInfo: { userId, userLogin },
    };
  }
}
