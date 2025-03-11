import { ObjectId } from "mongodb";
import { BlogDbType, BlogInputModel } from "../../../types/blogs-types";
import { blogsCollection } from "../mongodb";

export const blogsRepository = {
  async getAllBlogs(): Promise<BlogDbType[]> {
    const blogs = blogsCollection.find({}).toArray();
    return blogs;
  },
  async createNewBlog(blog: BlogInputModel): Promise<ObjectId> {
    const newBlog: BlogDbType = {
      ...blog,
      createdAt: new Date().toISOString(),
      isMembership: false,
    };
    const createResult = await blogsCollection.insertOne(newBlog);
    return createResult.insertedId;
  },
  async getBlogById(_id: ObjectId): Promise<BlogDbType | null> {
    return blogsCollection.findOne({ _id });
  },
  async updateBlog(_id: ObjectId, blog: BlogInputModel) {
    const updateResult = await blogsCollection.updateOne(
      { _id },
      { $set: { ...blog } }
    );

    return updateResult.matchedCount === 1;
  },
  async deleteBlog(_id: ObjectId) {
    const deleteResult = await blogsCollection.deleteOne({ _id });
    return deleteResult.deletedCount === 1;
  },
};
