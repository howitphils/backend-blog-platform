import { agent } from "supertest";
import { app } from "../src/app";
import { encodedCredentials } from "../src/middlewares/auth/basic-auth-validator";
import { userDtoType, UserViewModel } from "../src/types/users-types";
import { SETTINGS } from "../src/settings";

export const req = agent(app);

export const basicAuth = { authorization: `Basic ${encodedCredentials}` };

export const defaultPagination = {
  pagesCount: 0,
  page: 1,
  pageSize: 10,
  totalCount: 0,
  items: [],
};

export const createUserDto = ({ login, email, password }: userDtoType) => {
  return {
    login: login ?? "new-user",
    email: email ?? "example@gmail.com",
    password: password ?? "string",
  };
};

export const createNewUserInDb = async (
  user: userDtoType
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
