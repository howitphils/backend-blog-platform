import { ObjectId } from "mongodb";
import { BlogInputModel, BlogViewModel } from "../../../types/blogs-types";
import { blogsCollection } from "../mongodb";

export const blogsRepository = {
  async getAllBlogs(): Promise<BlogViewModel[]> {
    const blogs = blogsCollection.find({}).toArray();
    return blogs;
  },
  createNewBlog: async (blog: BlogInputModel): Promise<ObjectId> => {
    const newBlog: BlogViewModel = {
      ...blog,
      id: String(Math.random() * 1000),
      createdAt: new Date().toISOString(),
      isMembership: false,
    };
    const createResult = await blogsCollection.insertOne(newBlog);
    return createResult.insertedId;
  },
  async getBlogById(id: string): Promise<BlogViewModel | null> {
    return blogsCollection.findOne({ id });
  },
  async getBlogByUUId(_id: ObjectId): Promise<BlogViewModel | null> {
    return blogsCollection.findOne({ _id });
  },
  async updateBlog(id: string, blog: BlogInputModel) {
    const updateResult = await blogsCollection.updateOne(
      { id },
      { $set: { ...blog } }
    );

    return updateResult.matchedCount === 1;
  },
  async deleteBlog(id: string) {
    const deleteResult = await blogsCollection.deleteOne({ id });
    return deleteResult.deletedCount === 1;
  },
};
