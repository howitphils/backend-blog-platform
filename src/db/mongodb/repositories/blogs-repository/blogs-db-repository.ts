import { ObjectId } from "mongodb";
import { BlogDbType, BlogInputModel } from "../../../../types/blogs-types";
import { blogsCollection } from "../../mongodb";

export const blogsRepository = {
  // Создание нового блога
  async createNewBlog(blog: BlogDbType): Promise<ObjectId> {
    const createResult = await blogsCollection.insertOne(blog);
    return createResult.insertedId;
  },

  // Получение блога по айди
  async getBlogById(_id: ObjectId): Promise<BlogDbType | null> {
    return blogsCollection.findOne({ _id });
  },

  // Обновление блога
  async updateBlog(_id: ObjectId, blog: BlogInputModel): Promise<boolean> {
    const updateResult = await blogsCollection.updateOne(
      { _id },
      { $set: { ...blog } }
    );

    return updateResult.matchedCount === 1;
  },

  // Удаление блога
  async deleteBlog(_id: ObjectId): Promise<boolean> {
    const deleteResult = await blogsCollection.deleteOne({ _id });
    return deleteResult.deletedCount === 1;
  },
};
