import express, { Request, Response } from "express";
import cors from "cors";
import { SETTINGS } from "./settings";
import { blogsRouter } from "./routers/blogs-router";
import { postsRouter } from "./routers/posts-router";
import { testsRouter } from "./routers/tests-router";
import { usersRouter } from "./routers/users-router";
import { authRouter } from "./routers/auth-router";
import { commentsRouter } from "./routers/comments-router";
import { errorHandler } from "./middlewares/error-handler";
import cookieParser from "cookie-parser";
import { devicesRouter } from "./routers/devices-router";

export const app = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser());

// Для получения корректного ip
app.set("trust proxy", true);

app.use(SETTINGS.PATHS.BLOGS, blogsRouter);
app.use(SETTINGS.PATHS.POSTS, postsRouter);
app.use(SETTINGS.PATHS.TESTS, testsRouter);
app.use(SETTINGS.PATHS.USERS, usersRouter);
app.use(SETTINGS.PATHS.AUTH, authRouter);
app.use(SETTINGS.PATHS.COMMENTS, commentsRouter);
app.use(SETTINGS.PATHS.SECURITY, devicesRouter);

app.use(errorHandler);

app.get("/", (req: Request, res: Response) => {
  res.send("Hello, world!");
});
