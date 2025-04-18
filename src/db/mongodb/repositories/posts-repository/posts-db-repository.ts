import { ObjectId } from "mongodb";
import { PostDbType, PostInputModel } from "../../../../types/posts-types";
// import { db } from "../../mongo";
// import { SETTINGS } from "../../../../settings";
import { postsCollection } from "../../mongodb";

// const postsCollection = db.getCollections(SETTINGS.DB_NAME).postsCollection;

export const postsRepository = {
  async getAllPosts(): Promise<PostDbType[]> {
    return postsCollection.find({}).toArray();
  },

  async createNewPost(post: PostDbType): Promise<ObjectId> {
    const createResult = await postsCollection.insertOne(post);
    return createResult.insertedId;
  },

  async getPostById(_id: ObjectId): Promise<PostDbType | null> {
    return postsCollection.findOne({ _id });
  },

  async updatePost(_id: ObjectId, post: PostInputModel): Promise<boolean> {
    const updateResult = await postsCollection.updateOne(
      { _id },
      { $set: { ...post } }
    );
    return updateResult.matchedCount === 1;
  },

  async deletePost(_id: ObjectId): Promise<boolean> {
    const deleteResult = await postsCollection.deleteOne({ _id });
    return deleteResult.deletedCount === 1;
  },
};
