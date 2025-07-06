import { ObjectId, WithId } from "mongodb";
import { commentsCollection } from "../../mongodb";
import {
  CommentDbType,
  CommentInputModel,
} from "../../../../types/comments-types";
import { CommentDbDocument, CommentsModel } from "./comments-entity";

export class CommentsRepository {
  async save(comment: CommentDbDocument) {
    const result = await comment.save();
    return result.id;
  }

  async getCommentById(id: string): Promise<WithId<CommentDbType> | null> {
    return CommentsModel.findById(id);
  }

  // async createComment(comment: CommentDbType): Promise<ObjectId> {
  //   const createResult = await commentsCollection.insertOne(comment);
  //   return createResult.insertedId;
  // }

  // async deleteComment(_id: ObjectId): Promise<boolean> {
  //   const deleteResult = await commentsCollection.deleteOne({ _id });
  //   return deleteResult.deletedCount === 1;
  // }

  // async updateComment(
  //   _id: ObjectId,
  //   comment: CommentInputModel
  // ): Promise<boolean> {
  //   const updateResult = await commentsCollection.updateOne(
  //     { _id },
  //     { $set: { ...comment } }
  //   );
  //   return updateResult.matchedCount === 1;
  // }
}
