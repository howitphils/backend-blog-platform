// import { db } from "./../src/db/mongodb/mongo";
import { APP_CONFIG } from "../src/settings";
import { req } from "./test-helpers";
import { runDb } from "../src/db/mongodb/mongodb";
import { MongoClient } from "mongodb";
import { HttpStatuses } from "../src/types/http-statuses";

describe("/testing", () => {
  let client: MongoClient;

  beforeAll(async () => {
    client = await runDb(APP_CONFIG.MONGO_URL, APP_CONFIG.TEST_DB_NAME);
  });

  afterAll(async () => {
    await client.close();
    console.log("Connection closed");
  });

  it("should remove all data from db", async () => {
    await req
      .delete(APP_CONFIG.MAIN_PATHS.TESTS + "/all-data")
      .expect(HttpStatuses.NoContent);
  });
});
