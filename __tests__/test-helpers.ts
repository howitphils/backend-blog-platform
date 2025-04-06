import { agent } from "supertest";
import { app } from "../src/app";
import { encodedCredentials } from "../src/middlewares/auth/basic-auth-validator";
import { userDtoType } from "../src/types/users-types";
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
    password: password ?? "asdzxcqewq",
  };
};

export const createUserInDb = async (user: userDtoType) => {
  await req.post(SETTINGS.PATHS.USERS).set(basicAuth).send(user).expect(201);
};

export const createUsersInDb = async (count: number) => {
  for (let i = 1; i <= count; i++) {
    await createUserInDb({
      login: `user${i}`,
      email: `users${i}@gmail.com`,
      password: `users${i}`,
    });
  }
};
