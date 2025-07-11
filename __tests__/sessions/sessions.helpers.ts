import { APP_CONFIG } from "../../src/settings";
import { HttpStatuses } from "../../src/types/http-statuses";
import { SessionViewModel } from "../../src/types/sessions-types";
import { UserInputModel } from "../../src/types/users-types";
import { req } from "../test-helpers";

export const devicesTestHelper = {
  async getDevices(refreshToken: string): Promise<SessionViewModel[]> {
    const res = await req
      .get(APP_CONFIG.TEST_PATHS.DEVICES)
      .set("Cookie", `refreshToken=${refreshToken}`)
      .expect(HttpStatuses.Success);

    return res.body;
  },
  async loginUser(
    loginsCount: number,
    userDto: UserInputModel
  ): Promise<string[]> {
    const refreshTokens: string[] = [];

    for (let i = 1; i <= loginsCount; i++) {
      const res = await req
        .post(APP_CONFIG.MAIN_PATHS.AUTH + "/login")
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
