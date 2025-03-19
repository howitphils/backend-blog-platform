import { ObjectId } from "mongodb";

import { blogsRepository } from "../db/mongodb/repositories/blogs-repository/blogs-db-repository";
import {
  BlogDbType,
  BlogInputModel,
  BlogViewModel,
} from "../types/blogs-types";
import { mapFromDbToViewModel } from "../routers/controllers/utils";
import { PostDbType } from "../types/posts-types";
import { postsRepository } from "../db/mongodb/repositories/posts-repository/posts-db-repository";
import { blogsQueryRepository } from "../db/mongodb/repositories/blogs-repository/blogs-query-repositoy";

export const blogsService = {
  async createNewBlog(blog: BlogInputModel): Promise<ObjectId> {
    const newBlog: BlogDbType = {
      ...blog,
      createdAt: new Date().toISOString(),
      isMembership: false,
    };
    return blogsRepository.createNewBlog(newBlog);
  },

  async createNewPostForBlog(
    blogId: ObjectId,
    post: { title: string; shortDescription: string; content: string }
  ): Promise<ObjectId | null> {
    const targetBlog = await blogsQueryRepository.getBlogById(blogId);
    if (!targetBlog) {
      return null;
    }
    const convertedId = blogId.toString();
    const newPost: PostDbType = {
      ...post,
      blogId: convertedId,
      blogName: "Blog" + Math.random() * 1000,
      createdAt: new Date().toISOString(),
    };
    return postsRepository.createNewPost(newPost);
  },

  async getBlogById(_id: ObjectId): Promise<BlogViewModel | null> {
    const blog = await blogsRepository.getBlogById(_id);
    if (blog) {
      return mapFromDbToViewModel(blog) as BlogViewModel;
    }
    return null;
  },

  async updateBlog(_id: ObjectId, blog: BlogInputModel): Promise<boolean> {
    return blogsRepository.updateBlog(_id, blog);
  },

  async deleteBlog(_id: ObjectId): Promise<boolean> {
    return blogsRepository.deleteBlog(_id);
  },
};
