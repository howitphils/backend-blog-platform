import { db } from "./../src/db/mongodb/mongo";
import { SETTINGS } from "../src/settings";
import { req } from "./test-helpers";

describe("/testing", () => {
  beforeAll(async () => {
    await db.run(SETTINGS.MONGO_URL);
  });

  afterAll(async () => {
    await db.close();
    console.log("Connection closed");
  });

  it("should remove all data from db", async () => {
    await req.delete(SETTINGS.PATHS.TESTS + "/all-data").expect(204);
  });
});
