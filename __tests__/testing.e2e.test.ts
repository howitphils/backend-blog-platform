// import { db } from "./../src/db/mongodb/mongo";
import { SETTINGS } from "../src/settings";
import { req } from "./test-helpers";
import { runDb } from "../src/db/mongodb/mongodb";
import { MongoClient } from "mongodb";
import { HttpStatuses } from "../src/types/http-statuses";

describe("/testing", () => {
  let client: MongoClient;

  beforeAll(async () => {
    client = await runDb(SETTINGS.MONGO_URL, SETTINGS.TEST_DB_NAME);
  });

  afterAll(async () => {
    await client.close();
    console.log("Connection closed");
  });

  it("should remove all data from db", async () => {
    await req
      .delete(SETTINGS.PATHS.TESTS + "/all-data")
      .expect(HttpStatuses.NoContent);
  });
});
