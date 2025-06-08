import { SETTINGS } from "../../src/settings";
import { HttpStatuses } from "../../src/types/http-statuses";
import { req } from "../test-helpers";

export const devicesTestSeeder = {
  async loginUser(
    usersCredentials: { loginOrEmail: string; password: string },
    userAgentValue: string
  ) {
    await req
      .post(SETTINGS.PATHS.AUTH + "/login")
      .send({
        loginOrEmail: usersCredentials.loginOrEmail,
        password: usersCredentials.password,
      })
      .set("User-agent", userAgentValue)
      .expect(HttpStatuses.Success);
  },
};
