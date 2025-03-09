import { BlogInputModel, BlogViewModel } from "../../../types/blogs-types";
import { blogCollection } from "../mongodb";
// import { blogCollection } from "../db";

// const findIndexByIdHelper = (id: string) => {
//   // return db.blogs.findIndex((blog) => blog.id === id);
// };

export const blogsRepository = {
  getAllBlogs: async () => {
    const blogs = await blogCollection.find({}).toArray();
    return blogs;
  },
  createNewBlog: async (blog: BlogInputModel): Promise<BlogViewModel> => {
    const newBlog: BlogViewModel = {
      ...blog,
      id: String(Math.random() * 1000),
      createdAt: new Date().toISOString(),
      isMembership: false,
    };
    await blogCollection.insertOne(newBlog);
    return newBlog;
  },
  // getBlogById: (id: string) => {
  //   const targetBlogIndex = findIndexByIdHelper(id);
  //   if (targetBlogIndex === -1) return null;
  //   return db.blogs[targetBlogIndex];
  // },
  // updateBlog: (id: string, blog: BlogInputModel) => {
  //   const targetBlogIndex = findIndexByIdHelper(id);
  //   if (targetBlogIndex === -1) return null;
  //   db.blogs.splice(targetBlogIndex, 1, {
  //     ...db.blogs[targetBlogIndex],
  //     ...blog,
  //   });
  //   return db.blogs[targetBlogIndex];
  // },
  // deleteBlog: (id: string) => {
  //   const targetBlogIndex = findIndexByIdHelper(id);
  //   if (targetBlogIndex === -1) return null;
  //   return db.blogs.splice(targetBlogIndex, 1);
  // },
};
