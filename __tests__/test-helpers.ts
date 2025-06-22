import { agent } from "supertest";
import { app } from "../src/app";
import { encodedCredentials } from "../src/middlewares/auth/basic-auth-validator";
import { UserDtoType, UserViewModel } from "../src/types/users-types";
import { APP_CONFIG } from "../src/settings";
import { BlogDtoType, BlogViewModel } from "../src/types/blogs-types";
import {
  PostDtoType,
  PostForBlogDtoType,
  PostViewModel,
} from "../src/types/posts-types";
import { HttpStatuses } from "../src/types/http-statuses";

export const req = agent(app);

export const basicAuth = { authorization: `Basic ${encodedCredentials}` };

export const jwtAuth = (token: string) => ({
  authorization: `Bearer ${token}`,
});

export const defaultPagination = {
  pagesCount: 0,
  page: 1,
  pageSize: 10,
  totalCount: 0,
  items: [],
};

export const createUserDto = ({ login, email, password }: UserDtoType) => {
  return {
    login: login ?? "new-user",
    email: email ?? "example@gmail.com",
    password: password ?? "string",
  };
};

export const createNewUserInDb = async (
  user?: UserDtoType
): Promise<UserViewModel> => {
  if (!user) {
    user = createUserDto({});
  }

  const res = await req
    .post(APP_CONFIG.PATHS.USERS)
    .set(basicAuth)
    .send(user)
    .expect(HttpStatuses.Created);

  return res.body;
};

export const createUsersInDb = async (count: number) => {
  const users: UserViewModel[] = [];
  for (let i = 1; i <= count; i++) {
    const user = await createNewUserInDb({
      login: `user${i}`,
      email: `users${i}@gmail.com`,
      password: `users${i}`,
    });
    users.push(user);
  }
  return users;
};

export const createBlogDto = ({
  name,
  description,
  websiteUrl,
}: BlogDtoType) => {
  return {
    name: name ?? "test-blog",
    description: description ?? "for tests",
    websiteUrl: websiteUrl ?? "https://for_tests",
  };
};

export const createNewBlogInDb = async (
  blog?: BlogDtoType
): Promise<BlogViewModel> => {
  if (!blog) {
    blog = createBlogDto({});
  }
  const res = await req
    .post(APP_CONFIG.PATHS.BLOGS)
    .set(basicAuth)
    .send(blog)
    .expect(HttpStatuses.Created);

  return res.body;
};

export const createPostForBlogDto = ({
  title,
  content,
  shortDescription,
}: PostForBlogDtoType) => {
  return {
    title: title ?? "new-title",
    content: content ?? "new-content",
    shortDescription: shortDescription ?? "new-short-description",
  };
};

export const createPostDto = ({
  title,
  content,
  shortDescription,
  blogId,
}: PostDtoType) => {
  return {
    title: title ?? "new-title",
    content: content ?? "new-content",
    shortDescription: shortDescription ?? "new-short-description",
    blogId,
  };
};

export const createNewPostInDb = async (
  post?: PostForBlogDtoType | PostDtoType
): Promise<PostViewModel> => {
  if (!post) {
    post = createPostForBlogDto({});
  }
  const res = await req
    .post(APP_CONFIG.PATHS.POSTS)
    .set(basicAuth)
    .send(post)
    .expect(HttpStatuses.Created);

  return res.body;
};

export const createPostDtobHelper = async () => {
  const blogDb = await createNewBlogInDb();
  return createPostDto({ blogId: blogDb.id });
};

export const createPostInDbHelper = async () => {
  const postDto = await createPostDtobHelper();
  return createNewPostInDb(postDto);
};

export const getTokenPair = async (user?: UserDtoType) => {
  if (!user) {
    user = createUserDto({});
    await createNewUserInDb(user);
  }

  const res = await req
    .post(APP_CONFIG.PATHS.AUTH + "/login")
    .send({
      loginOrEmail: user.login,
      password: user.password,
    })
    .expect(HttpStatuses.Success);

  const accessToken = res.body.accessToken;
  const refreshTokenCookie = res.headers["set-cookie"][0];

  return { accessToken, refreshTokenCookie };
};

export const createContentDto = ({ content }: { content?: string }) => {
  return {
    content: content ?? "stringstringstringst",
  };
};

export const clearCollections = async () => {
  await req
    .delete(APP_CONFIG.PATHS.TESTS + "/all-data")
    .expect(HttpStatuses.NoContent);
};

export const createCommentInDb = async () => {
  const userDto = createUserDto({
    login: "random",
    email: "randomemail@email.com",
  });
  const dbUser = await createNewUserInDb(userDto);

  const dbPost = await createPostInDbHelper();

  const contentDto = createContentDto({});

  const token = (await getTokenPair(userDto)).accessToken;

  const res = await req
    .post(APP_CONFIG.PATHS.POSTS + `/${dbPost.id}` + "/comments")
    .set(jwtAuth(token))
    .send(contentDto)
    .expect(HttpStatuses.Created);

  return { comment: res.body, token, user: dbUser };
};

export const makeIncorrect = (id: string) => {
  return id.slice(0, -2) + "ab";
};

export const delay = (ms: number): Promise<void> => {
  return new Promise((res, rej) => {
    setTimeout(() => {
      res();
    }, ms);
  });
};
