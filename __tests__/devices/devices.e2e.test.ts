import { testSeeder } from "./../auth/auth.helpers";
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

describe("/devices", () => {
  let client: MongoClient;

  beforeAll(async () => {
    client = await runDb(SETTINGS.MONGO_URL, SETTINGS.TEST_DB_NAME);
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
      const userDto = testSeeder.createUserDto({});
      await testSeeder.insertUser(userDto);

      const res = await req.get(SETTINGS.PATHS.SECURITY + "/devices");
    });
  });
});
