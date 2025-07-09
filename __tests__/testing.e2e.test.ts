import { APP_CONFIG } from "../src/settings";
import { req } from "./test-helpers";

import { HttpStatuses } from "../src/types/http-statuses";
import mongoose from "mongoose";

describe("/testing", () => {
  beforeAll(async () => {
    await mongoose.connect(
      APP_CONFIG.MONGO_URL + "/" + APP_CONFIG.TEST_DB_NAME
    );
  });

  afterAll(async () => {
    await mongoose.disconnect();
    console.log("Connection closed");
  });

  it("should remove all data from db", async () => {
    await req
      .delete(APP_CONFIG.MAIN_PATHS.TESTS + "/all-data")
      .expect(HttpStatuses.NoContent);
  });
});
