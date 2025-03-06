import { BlogInputModel, BlogViewModel } from "../../types/blogs-types";
import { db } from "../db";

const findIndexByIdHelper = (id: string) => {
  return db.blogs.findIndex((blog) => blog.id === id);
};

export const blogsRepository = {
  getAllBlogs: () => {
    return db.blogs;
  },
  createNewBlog: (blog: BlogInputModel): BlogViewModel => {
    const newBlog: BlogViewModel = {
      ...blog,
      id: String(Math.random() * 1000),
    };
    db.blogs.unshift(newBlog);
    return newBlog;
  },
  getBlogById: (id: string) => {
    const targetBlogIndex = findIndexByIdHelper(id);
    if (targetBlogIndex === -1) return null;
    return db.blogs[targetBlogIndex];
  },
  updateBlog: (id: string, blog: BlogInputModel) => {
    const targetBlogIndex = findIndexByIdHelper(id);
    if (targetBlogIndex === -1) return null;
    db.blogs.splice(targetBlogIndex, 1, {
      ...db.blogs[targetBlogIndex],
      ...blog,
    });
    return db.blogs[targetBlogIndex];
  },
  deleteBlog: (id: string) => {
    const targetBlogIndex = findIndexByIdHelper(id);
    if (targetBlogIndex === -1) return null;
    return db.blogs.splice(targetBlogIndex, 1);
  },
};
