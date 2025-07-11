import { BlogDbType, BlogInputModel } from "../../../../types/blogs-types";
import { injectable } from "inversify";
import { BlogDbDocument, BlogsModel } from "./blogs-entity";

@injectable()
export class BlogsRepository {
  async save(blog: BlogDbDocument): Promise<string> {
    const result = await blog.save();
    return result.id;
  }

  // Создание нового блога
  async createNewBlog(blog: BlogDbType): Promise<string> {
    const dbBlog = new BlogsModel(blog);

    const result = await dbBlog.save();

    return result.id;
  }

  // Получение блога по айди
  async getBlogById(id: string): Promise<BlogDbDocument | null> {
    return BlogsModel.findById(id);
  }

  // Обновление блога
  async updateBlog(id: string, updatedBlog: BlogInputModel): Promise<boolean> {
    const updateResult = await BlogsModel.updateOne(
      { id },
      { $set: { ...updatedBlog } }
    );

    return updateResult.matchedCount === 1;
  }

  // Удаление блога
  async deleteBlog(id: string): Promise<boolean> {
    const blog = await BlogsModel.findById(id);

    if (!blog) {
      return false;
    }

    await blog.deleteOne();

    return true;
  }
}
