import { HttpStatuses } from "../../src/types/http-statuses";
import { APP_CONFIG } from "../../src/settings";
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
import mongoose from "mongoose";

describe("/auth", () => {
  beforeAll(async () => {
    await mongoose.connect(
      APP_CONFIG.MONGO_URL + "/" + APP_CONFIG.TEST_DB_NAME
    );
  });

  afterAll(async () => {
    await mongoose.disconnect();
    console.log("Connection closed");
  });

  describe(APP_CONFIG.ENDPOINT_PATHS.AUTH.LOGIN, () => {
    afterAll(async () => {
      await clearCollections();
    });

    it("it should login a correct user", async () => {
      const newUser = createUserDto({});
      await createNewUserInDb(newUser);

      const res = await req
        .post(APP_CONFIG.MAIN_PATHS.AUTH + "/login")
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
          expect.stringContaining(APP_CONFIG.REFRESH_TOKEN_COOKIE_NAME),
        ])
      );
    });

    it("it should not login a not existing user", async () => {
      await req
        .post(APP_CONFIG.MAIN_PATHS.AUTH + "/login")
        .send({
          loginOrEmail: "random",
          password: "string",
        })
        .expect(HttpStatuses.Unauthorized);
    });

    it("it should not login a user with incorrect input values", async () => {
      await req
        .post(APP_CONFIG.MAIN_PATHS.AUTH + "/login")
        .send({
          loginOrEmail: 221,
          password: false,
        })
        .expect(HttpStatuses.BadRequest);
    });
  });

  describe(APP_CONFIG.ENDPOINT_PATHS.AUTH.ME, () => {
    afterAll(async () => {
      await clearCollections();
    });

    it("should return user's info", async () => {
      const token = (await getTokenPair()).accessToken;

      const res = await req
        .get(APP_CONFIG.MAIN_PATHS.AUTH + "/me")
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
        .get(APP_CONFIG.MAIN_PATHS.AUTH + "/me")
        .expect(HttpStatuses.Unauthorized);
    });

    it("should not return user's info if token is invalid", async () => {
      await req
        .get(APP_CONFIG.MAIN_PATHS.AUTH + "/me")
        .set(jwtAuth("invalidToken"))
        .expect(HttpStatuses.Unauthorized);
    });
  });

  describe(APP_CONFIG.ENDPOINT_PATHS.AUTH.REFRESH_TOKEN, () => {
    afterAll(async () => {
      await clearCollections();
    });

    it("should return new token pair", async () => {
      const { accessToken, refreshTokenCookie } = await getTokenPair();

      await delay(1000);

      const res = await req
        .post(APP_CONFIG.MAIN_PATHS.AUTH + "/refresh-token")
        .set("Cookie", [refreshTokenCookie])
        .expect(HttpStatuses.Success);

      const oldRefreshToken = refreshTokenCookie.split(";")[0].split("=")[1];
      const newRefreshToken = res.headers["set-cookie"][0]
        .split(";")[0]
        .split("=")[1];

      expect(res.body).toEqual({
        accessToken: expect.any(String),
      });

      expect(res.body.accessToken).not.toBe(accessToken);
      expect(newRefreshToken).not.toBe(oldRefreshToken);
    });

    it("should return an error if cookie is not provided", async () => {
      await req
        .post(APP_CONFIG.MAIN_PATHS.AUTH + "/refresh-token")
        .expect(HttpStatuses.Unauthorized);
    });

    it("should return an error if the token inside the cookie is incorrect", async () => {
      await req
        .post(APP_CONFIG.MAIN_PATHS.AUTH + "/refresh-token")
        .set("Cookie", ["incorrectToken"])
        .expect(HttpStatuses.Unauthorized);
    });
  });
  describe(APP_CONFIG.ENDPOINT_PATHS.AUTH.LOGOUT, () => {
    afterAll(async () => {
      await clearCollections();
    });

    it("should successfully logout a user", async () => {
      const { refreshTokenCookie } = await getTokenPair();

      await req
        .post(APP_CONFIG.MAIN_PATHS.AUTH + "/logout")
        .set("Cookie", [refreshTokenCookie])
        .expect(HttpStatuses.NoContent);
    });

    it("should return an error if cookie is not provided", async () => {
      await req
        .post(APP_CONFIG.MAIN_PATHS.AUTH + "/logout")
        .expect(HttpStatuses.Unauthorized);
    });

    it("should return an error if the code inside the cookie is incorrect", async () => {
      await req
        .post(APP_CONFIG.MAIN_PATHS.AUTH + "/logout")
        .set("Cookie", ["incorrectToken"])
        .expect(HttpStatuses.Unauthorized);
    });
  });

  describe("password recovery", () => {
    afterAll(async () => {
      await clearCollections();
    });

    it("should return successful status even if user is not registered", async () => {
      await req
        .post(
          APP_CONFIG.MAIN_PATHS.AUTH +
            APP_CONFIG.ENDPOINT_PATHS.AUTH.PASSWORD_RECOVERY
        )
        .send({ email: "some@email.com" })
        .expect(HttpStatuses.NoContent);
    });

    it("should return an error for incorrect email", async () => {
      const res = await req
        .post(
          APP_CONFIG.MAIN_PATHS.AUTH +
            APP_CONFIG.ENDPOINT_PATHS.AUTH.PASSWORD_RECOVERY
        )
        .send({ email: "invalid^gmail.cm" })
        .expect(HttpStatuses.BadRequest);

      expect(res.body.errorsMessages[0].field).toBe("email");
      expect(res.body.errorsMessages[0].message).toBe("Must be an email");
    });

    it("should return an error for too many requests", async () => {
      for (let i = 0; i < APP_CONFIG.USER_LOGINS_TEST_COUNT - 1; i++) {
        await req
          .post(
            APP_CONFIG.MAIN_PATHS.AUTH +
              APP_CONFIG.ENDPOINT_PATHS.AUTH.PASSWORD_RECOVERY
          )
          .expect(HttpStatuses.BadRequest);
      }

      await req
        .post(
          APP_CONFIG.MAIN_PATHS.AUTH +
            APP_CONFIG.ENDPOINT_PATHS.AUTH.PASSWORD_RECOVERY
        )
        .expect(HttpStatuses.TooManyRequests);
    });
  });

  describe("confirm password recovery", () => {
    afterAll(async () => {
      await clearCollections();
    });

    it("should return an error for incorrect password length", async () => {
      const res = await req
        .post(
          APP_CONFIG.MAIN_PATHS.AUTH +
            APP_CONFIG.ENDPOINT_PATHS.AUTH.CONFIRM_PASSWORD_RECOVERY
        )
        .send({ newPassword: "12345", recoveryCode: "code" })
        .expect(HttpStatuses.BadRequest);

      expect(res.body.errorsMessages[0].field).toBe("newPassword");
      expect(res.body.errorsMessages[0].message).toBe(
        "Length must be between 6 and 20 symbols"
      );
    });

    it("should return an error for incorrect recovery code type", async () => {
      const res = await req
        .post(
          APP_CONFIG.MAIN_PATHS.AUTH +
            APP_CONFIG.ENDPOINT_PATHS.AUTH.CONFIRM_PASSWORD_RECOVERY
        )
        .send({ newPassword: "123456", recoveryCode: 22 })
        .expect(HttpStatuses.BadRequest);

      expect(res.body.errorsMessages[0].field).toBe("recoveryCode");
      expect(res.body.errorsMessages[0].message).toBe("Must be a string");
    });

    it("should return an error for too many requests", async () => {
      for (let i = 0; i < APP_CONFIG.USER_LOGINS_TEST_COUNT - 1; i++) {
        await req
          .post(
            APP_CONFIG.MAIN_PATHS.AUTH +
              APP_CONFIG.ENDPOINT_PATHS.AUTH.CONFIRM_PASSWORD_RECOVERY
          )
          .expect(HttpStatuses.BadRequest);
      }

      await req
        .post(
          APP_CONFIG.MAIN_PATHS.AUTH +
            APP_CONFIG.ENDPOINT_PATHS.AUTH.CONFIRM_PASSWORD_RECOVERY
        )
        .expect(HttpStatuses.TooManyRequests);
    });
  });
});
