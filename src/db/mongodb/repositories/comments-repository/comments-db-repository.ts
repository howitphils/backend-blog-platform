import { CommentModel } from "./comment-entity";
import { CommentDbDocumentType } from "./comment-entity-types";

export class CommentsRepository {
  async save(comment: CommentDbDocumentType) {
    const result = await comment.save();
    return result.id;
  }

  async getCommentById(id: string): Promise<CommentDbDocumentType | null> {
    return CommentModel.findById(id);
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
