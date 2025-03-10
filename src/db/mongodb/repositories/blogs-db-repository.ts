import { BlogInputModel, BlogViewModel } from "../../../types/blogs-types";
import { blogsCollection } from "../mongodb";

export const blogsRepository = {
  async getAllBlogs() {
    const blogs = await blogsCollection.find({}).toArray();
    return blogs;
  },
  createNewBlog: async (blog: BlogInputModel): Promise<BlogViewModel> => {
    const newBlog: BlogViewModel = {
      ...blog,
      id: String(Math.random() * 1000),
      createdAt: new Date().toISOString(),
      isMembership: false,
    };
    await blogsCollection.insertOne(newBlog);
    return newBlog;
  },
  async getBlogById(id: string): Promise<BlogViewModel | null> {
    const targetBlog = await blogsCollection.findOne({ id });
    return targetBlog;
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
