import { HttpStatuses } from "../../src/types/http-statuses";
import { APP_CONFIG } from "../../src/settings";
import {
  createNewUserInDb,
  createUserDto,
  delay,
  getTokenPair,
  req,
} from "../test-helpers";
import { MongoClient } from "mongodb";
import { runDb } from "../../src/db/mongodb/mongodb";
import { clearCollections } from "../test-helpers";
import { SessionViewModel } from "../../src/types/sessions-types";

describe("/devices", () => {
  let client: MongoClient;

  beforeAll(async () => {
    client = await runDb(APP_CONFIG.MONGO_URL, APP_CONFIG.TEST_DB_NAME);
  });

  afterAll(async () => {
    await client.close();
    console.log("Connection closed");
  });

  describe("get all devices", () => {
    afterAll(async () => {
      await clearCollections();
    });
    it("should return all user's sessions", async () => {
      const { refreshTokenCookie } = await getTokenPair();

      const res = await req
        .get(APP_CONFIG.TEST_PATHS.DEVICES)
        .set("Cookie", [refreshTokenCookie])
        .expect(HttpStatuses.Success);

      expect(res.body).toEqual([
        {
          deviceId: expect.any(String),
          ip: expect.any(String),
          lastActiveDate: expect.any(String),
          title: expect.any(String),
        },
      ]);
    });
    it("should not return all user's sessions for unauthorized user", async () => {
      await req
        .get(APP_CONFIG.TEST_PATHS.DEVICES)
        .expect(HttpStatuses.Unauthorized);
    });
  });

  describe("incubator tests", () => {
    afterAll(async () => {
      await clearCollections();
    });

    // beforeAll(async () => {
    //   const userDto = createUserDto({});
    //   await createNewUserInDb(userDto);
    //   const refreshTokens: string[] = [];

    //   for (let i = 0; i < APP_CONFIG.USER_LOGINS_TEST_COUNT; i++) {
    //     const { refreshTokenCookie } = await getTokenPair(userDto);

    //     refreshTokens.push(refreshTokenCookie.split(";")[0].split("=")[1]);
    //   }
    //   console.log(refreshTokens);
    // });

    const refreshTokens: string[] = [];
    let firstDevice: SessionViewModel;

    it("should login a user 4 times with different user-agent", async () => {
      const userDto = createUserDto({
        email: "first_user@test.com",
        login: "first_user",
      });
      await createNewUserInDb(userDto);

      for (let i = 1; i <= APP_CONFIG.USER_LOGINS_TEST_COUNT; i++) {
        const res = await req
          .post(APP_CONFIG.PATHS.AUTH + "/login")
          .send({
            loginOrEmail: userDto.login,
            password: userDto.password,
          })
          .set("User-agent", `device${i}`)
          .expect(HttpStatuses.Success);

        const refreshToken = res.headers["set-cookie"][0]
          .split(";")[0]
          .split("=")[1];

        refreshTokens.push(refreshToken);
      }

      const res = await req
        .get(APP_CONFIG.TEST_PATHS.DEVICES)
        .set("Cookie", [`refreshToken=${refreshTokens[0]}`])
        .expect(HttpStatuses.Success);

      console.log(res.body);

      firstDevice = res.body[0];

      expect(refreshTokens.length).toBe(APP_CONFIG.USER_LOGINS_TEST_COUNT);
      expect(res.body.length).toBe(APP_CONFIG.USER_LOGINS_TEST_COUNT);
      expect(res.body[0]).toHaveProperty("title");
    });

    it("return error if session is not found", async () => {
      await req
        .delete(APP_CONFIG.TEST_PATHS.DEVICES + "/12")
        .set("Cookie", [`refreshToken=${refreshTokens[0]}`])
        .expect(HttpStatuses.NotFound);
    });

    it("return error if user is not authorized", async () => {
      await req
        .delete(APP_CONFIG.TEST_PATHS.DEVICES + `/${firstDevice.deviceId}`)
        .expect(HttpStatuses.Unauthorized);
    });
    it("return error if user is trying to delete session that is not his own", async () => {
      // Создаем и логиним нового юзера и потом используем его куку в запросе
      const { refreshTokenCookie } = await getTokenPair();

      await req
        .delete(APP_CONFIG.TEST_PATHS.DEVICES + `/${firstDevice.deviceId}`)
        .set("Cookie", refreshTokenCookie)
        .expect(HttpStatuses.Forbidden);
    });
    it("should create new refresh token for device 1", async () => {
      const prevActiveDate = firstDevice.lastActiveDate;
      console.log(prevActiveDate);

      const res = await req
        .post(APP_CONFIG.TEST_PATHS.REFRESH_TOKEN)
        .set("Cookie", [`refreshToken=${refreshTokens[0]}`])
        .expect(HttpStatuses.Success);

      const newCookie = res.headers["set-cookie"][0];

      const res2 = await req
        .get(APP_CONFIG.TEST_PATHS.DEVICES)
        .set("Cookie", newCookie)
        .expect(HttpStatuses.Success);

      console.log(prevActiveDate);
      console.log(res2.body);

      expect(res2.body.length).toBe(APP_CONFIG.USER_LOGINS_TEST_COUNT);
      expect(res2.body[0].lastActiveDate).not.toBe(prevActiveDate);
    });
  });
});
