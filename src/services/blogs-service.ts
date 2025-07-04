import { ObjectId, WithId } from "mongodb";

import { BlogDbType, BlogInputModel } from "../types/blogs-types";
import { ErrorWithStatusCode } from "../middlewares/error-handler";
import { HttpStatuses } from "../types/http-statuses";
import { BlogsRepository } from "../db/mongodb/repositories/blogs-repository/blogs-db-repository";
import { inject, injectable } from "inversify";

@injectable()
export class BlogsService {
  constructor(
    @inject(BlogsRepository) private blogsRepository: BlogsRepository
  ) {}

  async createNewBlog(blog: BlogInputModel): Promise<ObjectId> {
    const newBlog: BlogDbType = {
      name: blog.name,
      description: blog.description,
      websiteUrl: blog.websiteUrl,
      createdAt: new Date().toISOString(),
      isMembership: false,
    };

    return this.blogsRepository.createNewBlog(newBlog);
  }

  async getBlogById(id: ObjectId): Promise<WithId<BlogDbType>> {
    const blog = await this.blogsRepository.getBlogById(id.toString());

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
    const targetBlog = await this.blogsRepository.getBlogById(id.toString());

    if (!targetBlog) {
      throw new ErrorWithStatusCode(
        "Blog does not exist",
        HttpStatuses.NotFound
      );
    }

    return this.blogsRepository.updateBlog(id, updatedBlog);
  }

  async deleteBlog(id: ObjectId): Promise<boolean> {
    const targetBlog = await this.blogsRepository.getBlogById(id.toString());

    if (!targetBlog) {
      throw new ErrorWithStatusCode(
        "Blog does not exist",
        HttpStatuses.NotFound
      );
    }

    return this.blogsRepository.deleteBlog(id);
  }
}
