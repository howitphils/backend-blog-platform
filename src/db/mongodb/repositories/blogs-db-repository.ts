import { PaginationType } from "./../../../types/blogs-types";
import { ObjectId } from "mongodb";
import { BlogDbType, BlogInputModel } from "../../../types/blogs-types";
import { blogsCollection, postsCollection } from "../mongodb";
import { MapedQueryType } from "../../../types/request-types";
import { mapFromDbToViewModel } from "../../../routers/controllers/utils";

export const blogsRepository = {
  // Получение всех блогов
  async getAllBlogs(filters: MapedQueryType): Promise<PaginationType> {
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
      items: blogs.map(mapFromDbToViewModel),
    };
  },
  // Получение постов конкретного блога
  async getAllPostsByBlogId(_id: ObjectId, queryParams: MapedQueryType) {
    const { pageNumber, pageSize, searchNameTerm, sortBy, sortDirection } =
      queryParams;

    const posts = await postsCollection
      .find(
        searchNameTerm ? { name: { $regex: searchNameTerm }, _id } : { _id }
      )
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
  // Создание нового блога
  async createNewBlog(blog: BlogDbType): Promise<ObjectId> {
    const createResult = await blogsCollection.insertOne(blog);
    return createResult.insertedId;
  },
  // Получение блога по айди
  async getBlogById(_id: ObjectId): Promise<BlogDbType | null> {
    return blogsCollection.findOne({ _id });
  },
  // Обновление блога
  async updateBlog(_id: ObjectId, blog: BlogInputModel): Promise<boolean> {
    const updateResult = await blogsCollection.updateOne(
      { _id },
      { $set: { ...blog } }
    );

    return updateResult.matchedCount === 1;
  },
  // Удаление блога
  async deleteBlog(_id: ObjectId): Promise<boolean> {
    const deleteResult = await blogsCollection.deleteOne({ _id });
    return deleteResult.deletedCount === 1;
  },
};
