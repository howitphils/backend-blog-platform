import { MongoClient } from "mongodb";
import { runDb } from "../src/db/mongodb/mongodb";
import { SETTINGS } from "../src/settings";
import { req } from "./test-helpers";

describe("/testing", () => {
  let client: MongoClient;
  beforeAll(async () => {
    // Создаем новое тестовое соединение
    client = await runDb(SETTINGS.MONGO_URL, SETTINGS.TEST_DB_NAME);
  });

  afterAll(async () => {
    // Закрываем коннект с дб
    await client.close();
    console.log("Connection closed");
  });

  it("should remove all data from db", async () => {
    const res = await req.delete(SETTINGS.PATHS.TESTS + "/all-data");

    expect(res.status).toBe(204);
  });
});
