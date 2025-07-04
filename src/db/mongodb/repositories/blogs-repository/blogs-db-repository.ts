import { ObjectId, WithId } from "mongodb";
import { BlogDbType, BlogInputModel } from "../../../../types/blogs-types";
// import { blogsCollection } from "../../mongodb";
import { injectable } from "inversify";
import mongoose from "mongoose";

const blogsSchema = new mongoose.Schema<BlogDbType>({
  name: { type: String, required: true },
  description: { type: String },
  websiteUrl: { type: String },
  createdAt: { type: String },
  isMembership: { type: Boolean },
});

export const BlogsModel = mongoose.model("Blog", blogsSchema);

@injectable()
export class BlogsRepository {
  // Создание нового блога
  async createNewBlog(blog: BlogDbType): Promise<ObjectId> {
    const createResult = await BlogsModel.insertOne(blog);
    return createResult._id;
  }

  // Получение блога по айди
  async getBlogById(id: string): Promise<WithId<BlogDbType> | null> {
    return BlogsModel.findById(id);
  }

  // Обновление блога
  async updateBlog(
    _id: ObjectId,
    updatedBlog: BlogInputModel
  ): Promise<boolean> {
    const updateResult = await BlogsModel.updateOne(
      { _id },
      { $set: { ...updatedBlog } }
    );

    return updateResult.matchedCount === 1;
  }

  // Удаление блога
  async deleteBlog(id: ObjectId): Promise<boolean> {
    const deleteResult = await BlogsModel.deleteOne({ _id: id });
    return deleteResult.deletedCount === 1;
  }
}
