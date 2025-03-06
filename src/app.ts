import express from "express";
import cors from "cors";
import { SETTINGS } from "./settings";
import { blogsRouter } from "./routers/blogs-router";
import { postsRouter } from "./routers/posts-router";

export const app = express();

app.use(cors());
app.use(express.json());

app.use(SETTINGS.PATHS.BLOGS, blogsRouter);
app.use(SETTINGS.PATHS.POSTS, postsRouter);
app.use(SETTINGS.PATHS.TESTS, postsRouter);

app.get("/", (req, res) => {
  res.send("Hello, Friend!");
});
