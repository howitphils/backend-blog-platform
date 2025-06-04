import { HttpStatuses } from "../../src/types/http-statuses";
import { SETTINGS } from "../../src/settings";
import {
  createNewUserInDb,
  createUserDto,
  delay,
  getTokenPair,
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

      const cookies = res.headers["set-cookie"];

      expect(res.body).toEqual({
        accessToken: expect.any(String),
      });

      expect(cookies).toBeDefined();
      expect(cookies.length).toBeGreaterThan(0);
      expect(cookies).toEqual(
        expect.arrayContaining([
          expect.stringContaining(SETTINGS.REFRESH_TOKEN_COOKIE_NAME),
        ])
      );
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
      const token = (await getTokenPair()).accessToken;

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

    it("should return new token pair", async () => {
      const { accessToken, refreshTokenCookie } = await getTokenPair();

      await delay(1000);

      const res = await req
        .post(SETTINGS.PATHS.AUTH + "/refresh-token")
        .set("Cookie", [refreshTokenCookie])
        .expect(HttpStatuses.Success);

      const oldRefreshToken = refreshTokenCookie.split(";")[0].split("=")[1];
      const newRefreshToken = res.headers["set-cookie"][0]
        .split(";")[0]
        .split("=")[1];

      console.log("compare: ", oldRefreshToken === newRefreshToken);

      expect(res.body).toEqual({
        accessToken: expect.any(String),
      });

      expect(res.body.accessToken).not.toBe(accessToken);
      expect(newRefreshToken).not.toBe(oldRefreshToken);
    });

    it("should return an error if cookie is not provided", async () => {
      await req
        .post(SETTINGS.PATHS.AUTH + "/refresh-token")
        .expect(HttpStatuses.Unauthorized);
    });

    it("should return an error if the token inside the cookie is incorrect", async () => {
      await req
        .post(SETTINGS.PATHS.AUTH + "/refresh-token")
        .set("Cookie", ["incorrectToken"])
        .expect(HttpStatuses.Unauthorized);
    });
  });
  describe("logout", () => {
    afterAll(async () => {
      await clearCollections();
    });

    it("should successfully logout a user", async () => {
      const { refreshTokenCookie } = await getTokenPair();

      await req
        .post(SETTINGS.PATHS.AUTH + "/logout")
        .set("Cookie", [refreshTokenCookie])
        .expect(HttpStatuses.NoContent);
    });

    it("should return an error if cookie is not provided", async () => {
      await req
        .post(SETTINGS.PATHS.AUTH + "/logout")
        .expect(HttpStatuses.Unauthorized);
    });

    it("should return an error if the code inside the cookie is incorrect", async () => {
      await req
        .post(SETTINGS.PATHS.AUTH + "/logout")
        .set("Cookie", ["incorrectToken"])
        .expect(HttpStatuses.Unauthorized);
    });
  });
});
