import { config } from "dotenv";
config();

export const SETTINGS = {
  PORT: process.env.PORT || 5003,
  PATHS: {
    POSTS: "/posts",
    BLOGS: "/blogs",
    TESTS: "/testing",
    USERS: "/users",
    AUTH: "/auth",
  },
  ADMIN: process.env.ADMIN || "admin:qwerty",
  MONGO_URL: process.env.MONGO_URL || "mongodb://localhost:27017",
  DB_NAME: process.env.DB_NAME,
  TEST_DB_NAME: process.env.TEST_DB_NAME,
  BLOGS_COLLECTION_NAME: "blogs",
  POSTS_COLLECTION_NAME: "posts",
  USERS_COLLECTION_NAME: "users",
};
