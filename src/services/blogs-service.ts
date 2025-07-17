import { WithId } from "mongodb";

import { BlogDbType, BlogInputModel } from "../types/blogs-types";
import { ErrorWithStatusCode } from "../middlewares/error-handler";
import { HttpStatuses } from "../types/http-statuses";
import { BlogsRepository } from "../db/mongodb/repositories/blogs-repository/blogs-db-repository";
import { inject, injectable } from "inversify";
import { BlogEntity } from "../db/mongodb/repositories/blogs-repository/blog-entity";

@injectable()
export class BlogsService {
  constructor(
    @inject(BlogsRepository) private blogsRepository: BlogsRepository
  ) {}

  async createNewBlog(blog: BlogInputModel): Promise<string> {
    const newBlog = BlogEntity.createNewBlog({
      description: blog.description,
      name: blog.name,
      websiteUrl: blog.websiteUrl,
    });

    return this.blogsRepository.save(newBlog);
  }

  async getBlogById(id: string): Promise<WithId<BlogDbType>> {
    const blog = await this.blogsRepository.getBlogById(id);

    if (!blog) {
      throw new ErrorWithStatusCode(
        "Blog does not exist",
        HttpStatuses.NotFound
      );
    }

    return blog;
  }

  async updateBlog(id: string, updatedBlog: BlogInputModel): Promise<void> {
    const targetBlog = await this.blogsRepository.getBlogById(id);

    if (!targetBlog) {
      throw new ErrorWithStatusCode(
        "Blog does not exist",
        HttpStatuses.NotFound
      );
    }

    targetBlog.updateBlog(updatedBlog);

    await this.blogsRepository.save(targetBlog);
  }

  async deleteBlog(id: string): Promise<void> {
    const targetBlog = await this.blogsRepository.getBlogById(id);

    if (!targetBlog) {
      throw new ErrorWithStatusCode(
        "Blog does not exist",
        HttpStatuses.NotFound
      );
    }

    await targetBlog.deleteOne();
  }
}
