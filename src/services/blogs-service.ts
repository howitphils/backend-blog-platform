import { ObjectId, WithId } from "mongodb";

import { blogsRepository } from "../db/mongodb/repositories/blogs-repository/blogs-db-repository";
import { BlogDbType, BlogInputModel } from "../types/blogs-types";
import { CustomError } from "../middlewares/error-handler";
import { HttpStatuses } from "../types/http-statuses";

export const blogsService = {
  async createNewBlog(blog: BlogInputModel): Promise<ObjectId> {
    const newBlog: BlogDbType = {
      name: blog.name,
      description: blog.description,
      websiteUrl: blog.websiteUrl,
      createdAt: new Date().toISOString(),
      isMembership: false,
    };

    return blogsRepository.createNewBlog(newBlog);
  },

  async getBlogById(_id: ObjectId): Promise<WithId<BlogDbType>> {
    const blog = await blogsRepository.getBlogById(_id);
    if (!blog) {
      throw new CustomError("Blog does not exist", HttpStatuses.NotFound);
    }
    return blog;
  },

  async updateBlog(_id: ObjectId, blog: BlogInputModel): Promise<boolean> {
    return blogsRepository.updateBlog(_id, blog);
  },

  async deleteBlog(_id: ObjectId): Promise<boolean> {
    return blogsRepository.deleteBlog(_id);
  },
};
