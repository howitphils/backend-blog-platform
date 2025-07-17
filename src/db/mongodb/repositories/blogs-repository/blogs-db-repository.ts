import { BlogDbType, BlogInputModel } from "../../../../types/blogs-types";
import { injectable } from "inversify";
import { BlogModel } from "./blog-entity";
import { BlogDbDocumentType } from "./blog-entity-type";

@injectable()
export class BlogsRepository {
  async save(blog: BlogDbDocumentType): Promise<string> {
    const result = await blog.save();
    return result.id;
  }

  // Создание нового блога
  async createNewBlog(blog: BlogDbType): Promise<string> {
    const dbBlog = new BlogModel(blog);

    const result = await dbBlog.save();

    return result.id;
  }

  // Получение блога по айди
  async getBlogById(id: string): Promise<BlogDbDocumentType | null> {
    return BlogModel.findById(id);
  }

  // Обновление блога
  async updateBlog(id: string, updatedBlog: BlogInputModel): Promise<boolean> {
    const updateResult = await BlogModel.updateOne(
      { id },
      { $set: { ...updatedBlog } }
    );

    return updateResult.matchedCount === 1;
  }

  // Удаление блога
  async deleteBlog(id: string): Promise<boolean> {
    const blog = await BlogModel.findById(id);

    if (!blog) {
      return false;
    }

    await blog.deleteOne();

    return true;
  }
}
