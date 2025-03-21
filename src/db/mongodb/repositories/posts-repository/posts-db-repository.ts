import { ObjectId } from "mongodb";
import { PostDbType, PostInputModel } from "../../../../types/posts-types";
import { postsCollection } from "../../mongodb";

export const postsRepository = {
  // Получение всех постов
  async getAllPosts(): Promise<PostDbType[]> {
    return postsCollection.find({}).toArray();
  },

  // Создание нового поста
  async createNewPost(post: PostDbType): Promise<ObjectId> {
    const createResult = await postsCollection.insertOne(post);
    return createResult.insertedId;
  },

  // Получение поста по его ID
  async getPostById(_id: ObjectId): Promise<PostDbType | null> {
    return postsCollection.findOne({ _id });
  },

  // Обновление поста
  async updatePost(_id: ObjectId, post: PostInputModel): Promise<boolean> {
    const updateResult = await postsCollection.updateOne(
      { _id },
      { $set: { ...post } }
    );
    return updateResult.matchedCount === 1;
  },

  // Удаление поста
  async deletePost(_id: ObjectId): Promise<boolean> {
    const deleteResult = await postsCollection.deleteOne({ _id });
    return deleteResult.deletedCount === 1;
  },
};
