import { SETTINGS } from "../src/settings";
import { clearCollections } from "./test-helpers";
import { MongoClient } from "mongodb";
import { runDb } from "../src/db/mongodb/mongodb";

describe("/comments", () => {
  let client: MongoClient;

  beforeAll(async () => {
    client = await runDb(SETTINGS.MONGO_URL, SETTINGS.TEST_DB_NAME);
  });

  afterAll(async () => {
    await client.close();
    console.log("Connection closed");
  });

  describe("get comment by id", () => {
    afterAll(async () => {
      await clearCollections();
    });

    it("should return a comment by id", async () => {
      // const res = await req.get(SETTINGS.PATHS.COMMENTS + );
    });
  });

  describe("update the comment", () => {
    afterAll(async () => {
      await clearCollections();
    });
  });

  describe("delete the comment", () => {
    afterAll(async () => {
      await clearCollections();
    });
  });
});
