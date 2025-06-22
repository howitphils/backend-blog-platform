import { APP_CONFIG } from "../../src/settings";
import { HttpStatuses } from "../../src/types/http-statuses";
import { UserInputModel } from "../../src/types/users-types";
import { req } from "../test-helpers";

export const devicesTestHelper = {
  async getDevices(refreshToken: string) {
    const res = await req
      .get(APP_CONFIG.TEST_PATHS.DEVICES)
      .set("Cookie", `refreshToken=${refreshToken}`)
      .expect(HttpStatuses.Success);

    return res.body;
  },
  async loginUser(count: number, userDto: UserInputModel) {
    const refreshTokens: string[] = [];

    for (let i = 1; i <= count; i++) {
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

    return refreshTokens;
  },
};
