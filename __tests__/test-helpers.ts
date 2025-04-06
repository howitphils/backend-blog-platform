import { agent } from "supertest";
import { app } from "../src/app";
import { encodedCredentials } from "../src/middlewares/auth/basic-auth-validator";
import { UserDtoType, UserViewModel } from "../src/types/users-types";
import { SETTINGS } from "../src/settings";
import { BlogDtoType, BlogViewModel } from "../src/types/blogs-types";
import { PostDtoType } from "../src/types/posts-types";

export const req = agent(app);

export const basicAuth = { authorization: `Basic ${encodedCredentials}` };

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
  user: UserDtoType
): Promise<UserViewModel> => {
  const res = await req
    .post(SETTINGS.PATHS.USERS)
    .set(basicAuth)
    .send(user)
    .expect(201);

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
    .post(SETTINGS.PATHS.BLOGS)
    .set(basicAuth)
    .send(blog)
    .expect(201);

  return res.body;
};

export const createPostDto = ({
  title,
  content,
  shortDescription,
}: PostDtoType) => {
  return {
    title: title ?? "new-title",
    content: content ?? "new-content",
    shortDescription: shortDescription ?? "new-short-description",
  };
};
