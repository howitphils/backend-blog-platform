import { ObjectId, WithId } from "mongodb";
import { commentsCollection } from "../../mongodb";
import {
  CommentDbType,
  CommentInputModel,
} from "../../../../types/comments-types";

export const commentsRepository = {
  async createComment(comment: CommentDbType): Promise<ObjectId> {
    const createResult = await commentsCollection.insertOne(comment);
    return createResult.insertedId;
  },

  async deleteComment(_id: ObjectId): Promise<boolean> {
    const deleteResult = await commentsCollection.deleteOne({ _id });
    return deleteResult.deletedCount === 1;
  },

  async updateComment(
    _id: ObjectId,
    comment: CommentInputModel
  ): Promise<boolean> {
    const updateResult = await commentsCollection.updateOne(
      { _id },
      { $set: { ...comment } }
    );
    return updateResult.matchedCount === 1;
  },

  async getCommentById(_id: ObjectId): Promise<WithId<CommentDbType> | null> {
    return commentsCollection.findOne({ _id });
  },
};
