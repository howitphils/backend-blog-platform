import { closeConnection } from "../src/db/mongodb/mongodb";
import { SETTINGS } from "../src/settings";
import { req } from "./test-helpers";

describe("/testing", () => {
  afterAll(async () => {
    await closeConnection();
  });

  it("should remove all data from db", async () => {
    const res = await req.delete(SETTINGS.PATHS.TESTS + "/all-data");

    expect(res.status).toBe(204);
  });
});
