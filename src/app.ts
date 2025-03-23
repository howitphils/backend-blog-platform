import express from "express";
import cors from "cors";
import { SETTINGS } from "./settings";
import { blogsRouter } from "./routers/blogs-router";
import { postsRouter } from "./routers/posts-router";
import { testsRouter } from "./routers/tests-router";
import { usersRouter } from "./routers/users-router";

export const app = express();

app.use(cors());
app.use(express.json());

app.use(SETTINGS.PATHS.BLOGS, blogsRouter);
app.use(SETTINGS.PATHS.POSTS, postsRouter);
app.use(SETTINGS.PATHS.TESTS, testsRouter);
app.use(SETTINGS.PATHS.USERS, usersRouter);

app.get("/", (req, res) => {
  res.send("Hello, Friend!");
});
