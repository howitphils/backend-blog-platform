import {
  BlogViewModel,
  BlogsMapedQueryType,
  PaginationType,
} from "../../../../types/blogs-types";
import { ObjectId, WithId } from "mongodb";
import { BlogDbType } from "../../../../types/blogs-types";
import { blogsCollection } from "../../mongodb";

export const blogsQueryRepository = {
  // Получение всех блогов
  async getAllBlogs(
    filters: BlogsMapedQueryType
  ): Promise<PaginationType<BlogViewModel>> {
    const { pageNumber, pageSize, searchNameTerm, sortBy, sortDirection } =
      filters;

    // Поиск блогов с учетом фильтров
    const blogs = await blogsCollection
      .find(
        searchNameTerm
          ? { name: { $regex: searchNameTerm, $options: "i" } }
          : {}
      )
      .sort({ [sortBy]: sortDirection === "desc" ? -1 : 1 })
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize)
      .toArray();

    // Подсчет общего количества блогов
    const totalCount = await blogsCollection.countDocuments(
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
      items: blogs.map(this.mapFromDbToViewModel),
    };
  },

  // Получение блога по айди
  async getBlogById(_id: ObjectId): Promise<BlogViewModel | null> {
    const targetBlog = await blogsCollection.findOne({ _id });
    if (targetBlog) {
      return this.mapFromDbToViewModel(targetBlog);
    } else {
      return null;
    }
  },

  // Преобразование данных из БД в формат, который будет отправлен клиенту
  mapFromDbToViewModel(blog: WithId<BlogDbType>): BlogViewModel {
    return {
      id: blog._id.toString(),
      createdAt: blog.createdAt,
      description: blog.description,
      isMembership: blog.isMembership,
      name: blog.name,
      websiteUrl: blog.websiteUrl,
    };
  },
};
