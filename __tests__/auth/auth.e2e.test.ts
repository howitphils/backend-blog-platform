import { HttpStatuses } from "../../src/types/http-statuses";
import { SETTINGS } from "../../src/settings";
import {
  createNewUserInDb,
  createUserDto,
  getAccessToken,
  jwtAuth,
  req,
} from "../test-helpers";
import { MongoClient } from "mongodb";
import { runDb } from "../../src/db/mongodb/mongodb";
import { clearCollections } from "../test-helpers";

describe("/auth", () => {
  let client: MongoClient;

  beforeAll(async () => {
    client = await runDb(SETTINGS.MONGO_URL, SETTINGS.TEST_DB_NAME);
  });

  afterAll(async () => {
    await client.close();
    console.log("Connection closed");
  });

  describe("login", () => {
    afterAll(async () => {
      await clearCollections();
    });

    it("it should login a correct user", async () => {
      const newUser = createUserDto({});
      await createNewUserInDb(newUser);

      const res = await req
        .post(SETTINGS.PATHS.AUTH + "/login")
        .send({
          loginOrEmail: newUser.login,
          password: newUser.password,
        })
        .expect(HttpStatuses.Success);

      expect(res.body).toEqual({
        accessToken: expect.any(String),
      });
    });

    it("it should not login a not existing user", async () => {
      await req
        .post(SETTINGS.PATHS.AUTH + "/login")
        .send({
          loginOrEmail: "random",
          password: "string",
        })
        .expect(HttpStatuses.Unauthorized);
    });

    it("it should not login a user with incorrect input values", async () => {
      await req
        .post(SETTINGS.PATHS.AUTH + "/login")
        .send({
          loginOrEmail: 221,
          password: false,
        })
        .expect(HttpStatuses.BadRequest);
    });
  });

  describe("me", () => {
    afterAll(async () => {
      await clearCollections();
    });

    it("should return user's info", async () => {
      const token = await getAccessToken();

      const res = await req
        .get(SETTINGS.PATHS.AUTH + "/me")
        .set(jwtAuth(token))
        .expect(HttpStatuses.Success);

      expect(res.body).toEqual({
        email: "example@gmail.com",
        login: "new-user",
        userId: expect.any(String),
      });
    });

    it("should not return user's info for unauthorized user", async () => {
      await req
        .get(SETTINGS.PATHS.AUTH + "/me")
        .expect(HttpStatuses.Unauthorized);
    });

    it("should not return user's info if token is invalid", async () => {
      await req
        .get(SETTINGS.PATHS.AUTH + "/me")
        .set(jwtAuth("invalidToken"))
        .expect(HttpStatuses.Unauthorized);
    });
  });

  describe("refresh token", () => {
    afterAll(async () => {
      await clearCollections();
    });

    // it('should ')
  });
});
