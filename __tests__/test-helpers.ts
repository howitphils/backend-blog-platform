import { agent } from "supertest";
import { app } from "../src/app";
import { encodedCredentials } from "../src/middlewares/auth/basic-auth-validator";

export const req = agent(app);

export const basicAuth = { authorization: `Basic ${encodedCredentials}` };

export const defaultPagination = {
  pagesCount: 0,
  page: 1,
  pageSize: 10,
  totalCount: 0,
  items: [],
};
