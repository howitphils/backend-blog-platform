import { config } from "dotenv";
config();

export const SETTINGS = {
  PORT: process.env.PORT || 5003,
  PATHS: {
    POSTS: "/posts",
    BLOGS: "/blogs",
    TESTS: "/__test__",
  },
  ADMIN: process.env.ADMIN || "admin:qwerty",
};
