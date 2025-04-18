import { HttpStatuses } from "./../src/types/http-statuses";
// import { db } from "./../src/db/mongodb/mongo";
import { SETTINGS } from "../src/settings";
import { createNewUserInDb, createUserDto, req } from "./test-helpers";
import { MongoClient } from "mongodb";
import { clearCollections, runDb } from "../src/db/mongodb/mongodb";

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
});
