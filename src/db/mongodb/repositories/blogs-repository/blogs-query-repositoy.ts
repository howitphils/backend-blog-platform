import {
  BlogViewModel,
  BlogsMapedQueryType,
  PaginationType,
} from "../../../../types/blogs-types";
import { ObjectId } from "mongodb";
import { BlogDbType } from "../../../../types/blogs-types";
import { blogsCollection, postsCollection } from "../../mongodb";
import { mapFromDbToViewModel } from "../../../../routers/controllers/utils";

export const blogsQueryRepository = {
  // Получение всех блогов
  async getAllBlogs(filters: BlogsMapedQueryType): Promise<PaginationType> {
    const { pageNumber, pageSize, searchNameTerm, sortBy, sortDirection } =
      filters;

    const blogs = await blogsCollection
      .find(searchNameTerm ? { name: { $regex: searchNameTerm } } : {})
      .sort({ [sortBy]: sortDirection === "desc" ? -1 : 1 })
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize)
      .toArray();

    const totalCount = await blogsCollection.countDocuments(
      searchNameTerm ? { name: { $regex: searchNameTerm, $options: "i" } } : {} // options: 'i' для игнорирования регистра
    );

    return {
      page: pageNumber,
      pagesCount: Math.ceil(totalCount / pageSize),
      pageSize: pageSize,
      totalCount,
      items: blogs.map(this.mapFromDbToViewModel),
    };
  },

  // Получение постов конкретного блога
  async getAllPostsByBlogId(
    _id: ObjectId,
    queryParams: BlogsMapedQueryType
  ): Promise<PaginationType> {
    const { pageNumber, pageSize, searchNameTerm, sortBy, sortDirection } =
      queryParams;

    const posts = await postsCollection
      .find({ blogId: _id.toString() })
      .sort({ [sortBy]: sortDirection === "desc" ? -1 : 1 })
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize)
      .toArray();
    const totalCount = await postsCollection.countDocuments(
      searchNameTerm ? { name: { $regex: searchNameTerm }, _id } : { _id }
    );

    return {
      page: pageNumber,
      pagesCount: Math.ceil(totalCount / pageSize),
      pageSize: pageSize,
      totalCount,
      items: posts.map(mapFromDbToViewModel),
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

  mapFromDbToViewModel(obj: BlogDbType): BlogViewModel {
    const { _id, ...rest } = obj;
    return { ...rest, id: _id!.toString() };
  },
};
