import { ObjectId } from "mongodb";
import { BlogDbType, BlogInputModel } from "../../../types/blogs-types";
import { blogsCollection } from "../mongodb";
import { RequestQueryType } from "../../../types/request-types";

export const blogsRepository = {
  async getAllBlogs(filters: RequestQueryType): Promise<BlogDbType[]> {
    const { pageNumber, pageSize, searchNameTerm, sortBy, sortDirection } =
      filters;

    const skipCount = (Number(pageNumber) - 1) * Number(pageSize);
    console.log(skipCount);

    return blogsCollection
      .find(searchNameTerm ? { name: { $regex: searchNameTerm } } : {})
      .sort({ [sortBy]: sortDirection === "desc" ? -1 : 1 })
      .skip(skipCount)
      .limit(+pageSize)
      .toArray();
  },
  async createNewBlog(blog: BlogInputModel): Promise<ObjectId> {
    const newBlog: BlogDbType = {
      ...blog,
      createdAt: new Date().toISOString(),
      isMembership: false,
    };
    const createResult = await blogsCollection.insertOne(newBlog);
    return createResult.insertedId;
  },
  async getBlogById(_id: ObjectId): Promise<BlogDbType | null> {
    return blogsCollection.findOne({ _id });
  },
  async updateBlog(_id: ObjectId, blog: BlogInputModel): Promise<boolean> {
    const updateResult = await blogsCollection.updateOne(
      { _id },
      { $set: { ...blog } }
    );

    return updateResult.matchedCount === 1;
  },
  async deleteBlog(_id: ObjectId): Promise<boolean> {
    const deleteResult = await blogsCollection.deleteOne({ _id });
    return deleteResult.deletedCount === 1;
  },
};
