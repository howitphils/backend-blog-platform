import { ObjectId, WithId } from "mongodb";

import { blogsRepository } from "../db/mongodb/repositories/blogs-repository/blogs-db-repository";
import { BlogDbType, BlogInputModel } from "../types/blogs-types";
import { ErrorWithStatusCode } from "../middlewares/error-handler";
import { HttpStatuses } from "../types/http-statuses";

class BlogsService {
  async createNewBlog(blog: BlogInputModel): Promise<ObjectId> {
    const newBlog: BlogDbType = {
      name: blog.name,
      description: blog.description,
      websiteUrl: blog.websiteUrl,
      createdAt: new Date().toISOString(),
      isMembership: false,
    };

    return blogsRepository.createNewBlog(newBlog);
  }

  async getBlogById(id: ObjectId): Promise<WithId<BlogDbType>> {
    const blog = await blogsRepository.getBlogById(id);

    if (!blog) {
      throw new ErrorWithStatusCode(
        "Blog does not exist",
        HttpStatuses.NotFound
      );
    }

    return blog;
  }

  async updateBlog(
    id: ObjectId,
    updatedBlog: BlogInputModel
  ): Promise<boolean> {
    const targetBlog = await blogsRepository.getBlogById(id);

    if (!targetBlog) {
      throw new ErrorWithStatusCode(
        "Blog does not exist",
        HttpStatuses.NotFound
      );
    }

    return blogsRepository.updateBlog(id, updatedBlog);
  }

  async deleteBlog(id: ObjectId): Promise<boolean> {
    const targetBlog = await blogsRepository.getBlogById(id);

    if (!targetBlog) {
      throw new ErrorWithStatusCode(
        "Blog does not exist",
        HttpStatuses.NotFound
      );
    }

    return blogsRepository.deleteBlog(id);
  }
}

export const blogsService = new BlogsService();
