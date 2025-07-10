import {
  BlogViewModel,
  BlogsMapedQueryType,
} from "../../../../types/blogs-types";
import { WithId } from "mongodb";
import { BlogDbType } from "../../../../types/blogs-types";
import { PaginationType } from "../../../../types/common-types";
import { BlogsModel } from "./blogs-entity";

export class BlogsQueryRepository {
  async getAllBlogs(
    filters: BlogsMapedQueryType
  ): Promise<PaginationType<BlogViewModel>> {
    const { pageNumber, pageSize, searchNameTerm, sortBy, sortDirection } =
      filters;

    // Поиск блогов с учетом фильтров
    const blogs = await BlogsModel.find(
      searchNameTerm ? { name: { $regex: searchNameTerm, $options: "i" } } : {}
    )
      .sort({ [sortBy]: sortDirection === "desc" ? -1 : 1 })
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize)
      .lean();

    // Подсчет общего количества блогов
    const totalCount = await BlogsModel.countDocuments(
      searchNameTerm
        ? {
            name: { $regex: searchNameTerm, $options: "i" },
          }
        : {}
    );

    return {
      page: pageNumber,
      pagesCount: Math.ceil(totalCount / pageSize),
      pageSize: pageSize,
      totalCount,
      items: blogs.map(this._mapFromDbToViewModel),
    };
  }

  async getBlogById(id: string): Promise<BlogViewModel | null> {
    const targetBlog = await BlogsModel.findById(id);
    if (targetBlog) {
      return this._mapFromDbToViewModel(targetBlog);
    } else {
      return null;
    }
  }

  // Преобразование данных из БД в формат, который будет отправлен клиенту
  _mapFromDbToViewModel(blog: WithId<BlogDbType>): BlogViewModel {
    return {
      id: blog._id.toString(),
      createdAt: blog.createdAt,
      description: blog.description,
      isMembership: blog.isMembership,
      name: blog.name,
      websiteUrl: blog.websiteUrl,
    };
  }
}
