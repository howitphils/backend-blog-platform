import { config } from "dotenv";
config();

export const SETTINGS = {
  PORT: process.env.PORT || 5003,
  PATHS: {
    BLOGS: "/blogs",
    POSTS: "/posts",
    TESTS: "/testing",
    USERS: "/users",
    AUTH: "/auth",
    COMMENTS: "/comments",
  },
  ADMIN: process.env.ADMIN || "admin:qwerty",
  MONGO_URL: process.env.MONGO_URL || "mongodb://localhost:27017",
  DB_NAME: process.env.DB_NAME || "blog-platform-dev",
  TEST_DB_NAME: "test-db",
  COLLECTIONS: {
    BLOGS_COLLECTION_NAME: "blogs",
    POSTS_COLLECTION_NAME: "posts",
    USERS_COLLECTION_NAME: "users",
    COMMENTS_COLLECTION_NAME: "comments",
  },
  JWT_SECRET_ACCESS: process.env.JWT_SECRET_ACCESS as string,
  JWT_SECRET_REFRESH: process.env.JWT_SECRET_REFRESH as string,
  REFRESH_TOKEN_COOKIE_NAME: "refreshToken",
};
