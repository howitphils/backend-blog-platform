import {
  CommentsMapedQueryType,
  CommentViewModel,
} from "../../../../types/comments-types";
import {
  LikesStatusesObjType,
  LikeStatuses,
  PaginationType,
} from "../../../../types/common-types";
import { CommentLikeDbDocumentType } from "../likes-repository/comment-likes/comment-entity-types";
import { CommentLikeModel } from "../likes-repository/comment-likes/comment-like-entity";

import { CommentModel } from "./comment-entity";

export class CommentsQueryRepository {
  // Получение всех комментариев с учетом query параметров
  async getAllCommentsForPost(
    filters: CommentsMapedQueryType,
    postId: string,
    userId: string | undefined
  ): Promise<PaginationType<CommentViewModel>> {
    const { pageNumber, pageSize, sortBy, sortDirection } = filters;

    // Получаем комментарии с учетом query параметров
    const comments = await CommentModel.find({ postId })
      .sort({ [sortBy]: sortDirection === "desc" ? -1 : 1 })
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize);

    // Получаем число всех комментов конкретного поста
    const totalCount = await CommentModel.countDocuments({ postId });

    let likesObj: LikesStatusesObjType = {};

    if (userId) {
      const commentsIds = comments.map((comment) => comment.id);

      // Получаем лайки для всех комментариев юзера
      const likes = await CommentLikeModel.find({
        commentId: { $in: commentsIds },
        userId,
      }).lean();

      likesObj = likes.reduce((acc: LikesStatusesObjType, like) => {
        acc[like.commentId] = like.status;
        return acc;
      }, {});
    }

    return {
      page: pageNumber,
      pagesCount: Math.ceil(totalCount / pageSize),
      pageSize: pageSize,
      totalCount,
      items: comments.map((comment) => {
        return {
          commentatorInfo: comment.commentatorInfo,
          content: comment.content,
          createdAt: comment.createdAt,
          id: comment.id,
          likesInfo: {
            likesCount: comment.likesCount,
            dislikesCount: comment.dislikesCount,
            myStatus: likesObj[comment.id] || LikeStatuses.None,
          },
        };
      }),
    };
  }

  async getCommentById(
    commentId: string,
    userId: string
  ): Promise<CommentViewModel | null> {
    const targetComment = await CommentModel.findById(commentId);

    if (!targetComment) return null;

    let userLike: CommentLikeDbDocumentType | null = null;

    if (userId !== "") {
      userLike = await CommentLikeModel.findOne({ commentId, userId });
    }

    return {
      content: targetComment.content,
      createdAt: targetComment.createdAt,
      id: targetComment.id,
      commentatorInfo: {
        userId: targetComment.commentatorInfo.userId,
        userLogin: targetComment.commentatorInfo.userLogin,
      },
      likesInfo: {
        likesCount: targetComment.likesCount,
        dislikesCount: targetComment.dislikesCount,
        myStatus: userLike ? userLike.status : LikeStatuses.None,
      },
    };

    // return this._mapFromDbToViewModel(targetComment, userId);
  }

  // Преобразование комментария из формата бд в формат, который ожидает клиент
  // async _mapFromDbToViewModel(
  //   comment: CommentDbDocument,
  //   userId: string
  // ): CommentViewModel {
  //   const { id, content, createdAt, commentatorInfo } = comment;

  //   const likesCount = await CommentLikesModel.countDocuments({
  //     status: CommentLikeStatus.Like,
  //     id,
  //   });
  //   const dislikesCount = await CommentLikesModel.countDocuments({
  //     status: CommentLikeStatus.Dislike,
  //     id,
  //   });

  //   const targetLike = await CommentLikesModel.findOne({
  //     id,
  //     userId,
  //   });

  //   return {
  //     id,
  //     content,
  //     createdAt,
  //     commentatorInfo: commentatorInfo,
  //     likesInfo: {
  //       likesCount: likesCount,
  //       dislikesCount: dislikesCount,
  //       myStatus: targetLike?.status || CommentLikeStatus.None,
  //     },
  //   };
  // }
}
