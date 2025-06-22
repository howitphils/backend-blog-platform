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
import { devicesTestHelper } from "./sessions.helpers";

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

    let refreshTokens: string[] = [];
    let devices: SessionViewModel[];

    it("should login a user 4 times with different user-agent", async () => {
      const userDto = createUserDto({
        email: "first_user@test.com",
        login: "first_user",
      });
      await createNewUserInDb(userDto);

      refreshTokens = await devicesTestHelper.loginUser(
        APP_CONFIG.USER_LOGINS_TEST_COUNT,
        userDto
      );

      const devicesArr = await devicesTestHelper.getDevices(refreshTokens[0]);

      devices = devicesArr;

      expect(refreshTokens.length).toBe(APP_CONFIG.USER_LOGINS_TEST_COUNT);
      expect(devices.length).toBe(APP_CONFIG.USER_LOGINS_TEST_COUNT);
      expect(devices[0]).toEqual({
        ip: expect.any(String),
        title: expect.any(String),
        lastActiveDate: expect.any(String),
        deviceId: expect.any(String),
      });
    });

    it("return error if session is not found", async () => {
      await req
        .delete(APP_CONFIG.TEST_PATHS.DEVICES + "/12")
        .set("Cookie", [`refreshToken=${refreshTokens[0]}`])
        .expect(HttpStatuses.NotFound);
    });

    it("return error if user is not authorized", async () => {
      await req
        .delete(APP_CONFIG.TEST_PATHS.DEVICES + `/${devices[0].deviceId}`)
        .expect(HttpStatuses.Unauthorized);
    });
    it("return error if user is trying to delete session that is not his own", async () => {
      // Создаем и логиним нового юзера и потом используем его куку в запросе
      const { refreshTokenCookie } = await getTokenPair();

      await req
        .delete(APP_CONFIG.TEST_PATHS.DEVICES + `/${devices[0].deviceId}`)
        .set("Cookie", refreshTokenCookie)
        .expect(HttpStatuses.Forbidden);
    });

    let newRefreshToken: string;
    it("should create new refresh token for device 1", async () => {
      await delay(1000);

      const res = await req
        .post(APP_CONFIG.TEST_PATHS.REFRESH_TOKEN)
        .set("Cookie", [`refreshToken=${refreshTokens[0]}`])
        .expect(HttpStatuses.Success);

      newRefreshToken = res.headers["set-cookie"][0]
        .split(";")[0]
        .split("=")[1];

      expect(newRefreshToken).not.toBe(refreshTokens[0]);
    });

    it("should return devices with updated lastActiveDate for device1", async () => {
      const prevActiveDate = devices[0].lastActiveDate;

      const devicesArr = await devicesTestHelper.getDevices(refreshTokens[0]);

      for (let i = 0; i < devices.length; i++) {
        expect(devicesArr[i].deviceId).toBe(devices[i].deviceId);
      }

      expect(devicesArr.length).toBe(APP_CONFIG.USER_LOGINS_TEST_COUNT);
      expect(devicesArr[0].lastActiveDate).not.toBe(prevActiveDate);
    });

    it("should delete device 2", async () => {
      await req
        .delete(APP_CONFIG.TEST_PATHS.DEVICES + `/${devices[1].deviceId}`)
        .set("Cookie", `refreshToken=${refreshTokens[0]}`)
        .expect(HttpStatuses.NoContent);

      const devicesArr = await devicesTestHelper.getDevices(refreshTokens[0]);

      expect(devicesArr.length).toBe(APP_CONFIG.USER_LOGINS_TEST_COUNT - 1);
      expect(devicesArr[1].title).not.toBe("device2");
      expect(devicesArr[1].title).toBe("device3");
    });

    it("should logout device 3", async () => {
      await req
        .post(APP_CONFIG.TEST_PATHS.LOGOUT)
        .set("Cookie", `refreshToken=${refreshTokens[2]}`)
        .expect(HttpStatuses.NoContent);

      const devices = await devicesTestHelper.getDevices(refreshTokens[0]);

      expect(devices.length).toBe(APP_CONFIG.USER_LOGINS_TEST_COUNT - 2);
      expect(devices[1].title).not.toBe("device3");
      expect(devices[1].title).toBe("device4");
    });

    it("should remove all devices except 1", async () => {
      await req
        .delete(APP_CONFIG.TEST_PATHS.DEVICES)
        .set("Cookie", `refreshToken=${refreshTokens[0]}`)
        .expect(HttpStatuses.NoContent);

      const devices = await devicesTestHelper.getDevices(refreshTokens[0]);

      expect(devices.length).toBe(1);
      expect(devices[0].title).toBe("device1");
    });
  });
});
