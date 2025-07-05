import { WithId } from "mongodb";

import {
  BlogDbType,
  BlogInputModel,
  UpdateBlogInputModel,
} from "../types/blogs-types";
import { ErrorWithStatusCode } from "../middlewares/error-handler";
import { HttpStatuses } from "../types/http-statuses";
import { BlogsRepository } from "../db/mongodb/repositories/blogs-repository/blogs-db-repository";
import { inject, injectable } from "inversify";
import { BlogsModel } from "../db/mongodb/repositories/blogs-repository/blogs-entity";

@injectable()
export class BlogsService {
  constructor(
    @inject(BlogsRepository) private blogsRepository: BlogsRepository
  ) {}

  async createNewBlog(blog: BlogInputModel): Promise<string> {
    // const { description, name, websiteUrl } = blog;

    // const newBlog: BlogDbType = new Blog(name, description, websiteUrl);

    const dbBlog = new BlogsModel(blog);

    dbBlog.createdAt = new Date().toISOString();
    dbBlog.isMembership = false;

    return this.blogsRepository.save(dbBlog);
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

  async updateBlog(
    id: string,
    updatedBlog: UpdateBlogInputModel
  ): Promise<void> {
    const targetBlog = await this.blogsRepository.getBlogById(id);

    if (!targetBlog) {
      throw new ErrorWithStatusCode(
        "Blog does not exist",
        HttpStatuses.NotFound
      );
    }

    targetBlog.name = updatedBlog.newName;
    targetBlog.description = updatedBlog.newDescription;
    targetBlog.websiteUrl = updatedBlog.newWebsiteUrl;

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
