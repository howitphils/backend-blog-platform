// import { db } from "./../src/db/mongodb/mongo";
import { APP_CONFIG } from "../src/settings";
import {
  basicAuth,
  clearCollections,
  createNewUserInDb,
  createUserDto,
  defaultPagination,
  makeIncorrect,
  req,
} from "./test-helpers";
import { MongoClient } from "mongodb";
import { runDb } from "../src/db/mongodb/mongodb";
import { HttpStatuses } from "../src/types/http-statuses";

describe("/users", () => {
  let client: MongoClient;

  beforeAll(async () => {
    client = await runDb(APP_CONFIG.MONGO_URL, APP_CONFIG.TEST_DB_NAME);
  });

  afterAll(async () => {
    await client.close();
    console.log("Connection closed");
  });

  describe("get users", () => {
    afterAll(async () => {
      await clearCollections();
    });

    it("should return all users", async () => {
      const res = await req
        .get(APP_CONFIG.MAIN_PATHS.USERS)
        .set(basicAuth)
        .expect(HttpStatuses.Success);

      expect(res.body).toEqual(defaultPagination);
    });
  });

  describe("create user", () => {
    afterAll(async () => {
      await clearCollections();
    });

    it("should create a user", async () => {
      const newUserDto = createUserDto({});

      const res = await req
        .post(APP_CONFIG.MAIN_PATHS.USERS)
        .set(basicAuth)
        .send(newUserDto)
        .expect(HttpStatuses.Created);

      expect(res.body).toEqual({
        id: expect.any(String),
        login: newUserDto.login,
        email: newUserDto.email,
        createdAt: expect.any(String),
      });
    });

    it("should not create a user with duplicated login", async () => {
      const newUserDto = createUserDto({ email: "unique-email@mail.ru" });

      const res = await req
        .post(APP_CONFIG.MAIN_PATHS.USERS)
        .set(basicAuth)
        .send(newUserDto)
        .expect(HttpStatuses.BadRequest);

      expect(res.body).toEqual({
        errorsMessages: [
          {
            field: "login",
            message: expect.any(String),
          },
        ],
      });
    });

    it("should not create a user with duplicated email", async () => {
      const newUserDto = createUserDto({ login: "unique" });

      const res = await req
        .post(APP_CONFIG.MAIN_PATHS.USERS)
        .set(basicAuth)
        .send(newUserDto)
        .expect(HttpStatuses.BadRequest);

      expect(res.body).toEqual({
        errorsMessages: [
          {
            field: "email",
            message: expect.any(String),
          },
        ],
      });
    });

    it("should not create a user with incorrect login", async () => {
      const invalidUserDtoMin = createUserDto({ login: "a".repeat(2) });
      const invalidUserDtoMax = createUserDto({ login: "ab".repeat(11) });
      const invalidUserDtoPattern = createUserDto({ login: "&^%$))" });

      const res = await req
        .post(APP_CONFIG.MAIN_PATHS.USERS)
        .set(basicAuth)
        .send(invalidUserDtoMin)
        .expect(HttpStatuses.BadRequest);

      expect(res.body).toEqual({
        errorsMessages: [
          {
            field: "login",
            message: expect.any(String),
          },
        ],
      });

      const res2 = await req
        .post(APP_CONFIG.MAIN_PATHS.USERS)
        .set(basicAuth)
        .send(invalidUserDtoMax)
        .expect(HttpStatuses.BadRequest);

      expect(res2.body).toEqual({
        errorsMessages: [
          {
            field: "login",
            message: expect.any(String),
          },
        ],
      });

      const res3 = await req
        .post(APP_CONFIG.MAIN_PATHS.USERS)
        .set(basicAuth)
        .send(invalidUserDtoPattern)
        .expect(HttpStatuses.BadRequest);

      expect(res3.body).toEqual({
        errorsMessages: [
          {
            field: "login",
            message: expect.any(String),
          },
        ],
      });
    });

    it("should not create a user with incorrect email", async () => {
      const invalidUserDtoPattern = createUserDto({ email: "hello" });

      const res = await req
        .post(APP_CONFIG.MAIN_PATHS.USERS)
        .set(basicAuth)
        .send(invalidUserDtoPattern)
        .expect(HttpStatuses.BadRequest);

      expect(res.body).toEqual({
        errorsMessages: [
          {
            field: "email",
            message: expect.any(String),
          },
        ],
      });
    });
  });

  describe("delete user", () => {
    afterAll(async () => {
      await clearCollections();
    });

    let userId = "";

    it("should not delete the user without authorization", async () => {
      const newUser = await createNewUserInDb();

      userId = newUser.id;

      await req
        .delete(APP_CONFIG.MAIN_PATHS.USERS + `/${userId}`)
        .expect(HttpStatuses.Unauthorized);
    });
    it("should not delete not existing user", async () => {
      await req
        .delete(`${APP_CONFIG.MAIN_PATHS.USERS}/${makeIncorrect(userId)}`)
        .set(basicAuth)
        .expect(HttpStatuses.NotFound);
    });
    it("should delete the user", async () => {
      await req
        .delete(APP_CONFIG.MAIN_PATHS.USERS + `/${userId}`)
        .set(basicAuth)
        .expect(HttpStatuses.NoContent);

      await req
        .delete(APP_CONFIG.MAIN_PATHS.USERS + `/${userId}`)
        .set(basicAuth)
        .expect(HttpStatuses.NotFound);
    });
  });
});
