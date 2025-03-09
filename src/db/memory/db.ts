import { BlogViewModel } from "../../types/blogs-types";
import { PostViewModel } from "../../types/posts-types";

export type DBType = {
  // типизация базы данных (что мы будем в ней хранить)
  blogs: BlogViewModel[];
  posts: PostViewModel[];
};

export const db: DBType = {
  // создаём базу данных (пока это просто переменная)
  blogs: [],
  posts: [],
};

export const setDb = () => {
  db.blogs = [];
  db.posts = [];
};
