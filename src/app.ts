import express, { Request, Response } from "express";
import cors from "cors";
import { APP_CONFIG } from "./settings";
import { blogsRouter } from "./routers/blogs-router";
import { postsRouter } from "./routers/posts-router";
import { testsRouter } from "./routers/tests-router";
import { usersRouter } from "./routers/users-router";
import { authRouter } from "./routers/auth-router";
import { commentsRouter } from "./routers/comments-router";
import { errorHandler } from "./middlewares/error-handler";
import cookieParser from "cookie-parser";
import { sessionsRouter } from "./routers/sessions-router";

export const app = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser());

// Для получения корректного ip
app.set("trust proxy", true);

app.use(APP_CONFIG.MAIN_PATHS.BLOGS, blogsRouter);
app.use(APP_CONFIG.MAIN_PATHS.POSTS, postsRouter);
app.use(APP_CONFIG.MAIN_PATHS.TESTS, testsRouter);
app.use(APP_CONFIG.MAIN_PATHS.USERS, usersRouter);
app.use(APP_CONFIG.MAIN_PATHS.AUTH, authRouter);
app.use(APP_CONFIG.MAIN_PATHS.COMMENTS, commentsRouter);
app.use(APP_CONFIG.MAIN_PATHS.SECURITY, sessionsRouter);

app.use(errorHandler);

app.get("/", (req: Request, res: Response) => {
  res.send("Hello, world!");
});
