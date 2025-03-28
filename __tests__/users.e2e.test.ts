import { MongoClient } from "mongodb";
import { clearCollections, runDb } from "../src/db/mongodb/mongodb";
import { SETTINGS } from "../src/settings";
import { req } from "./test-helpers";
import { encodedCredentials } from "../src/middlewares/auth-validator";

describe("/users", () => {
  let client: MongoClient;

  beforeAll(async () => {
    // Создаем новое тестовое соединение
    client = await runDb(SETTINGS.MONGO_URL, SETTINGS.TEST_DB_NAME);

    // Очищаем коллекции
    await clearCollections();
  });

  afterAll(async () => {
    // Закрываем коннект с дб
    await client.close();
    console.log("Connection closed");
  });

  it("should return all users", async () => {
    const res = await req
      .get(SETTINGS.PATHS.USERS)
      .set("Authorization", `Basic ${encodedCredentials}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("items");
    expect(res.body).toHaveProperty("page");
    expect(res.body).toHaveProperty("totalCount");
    expect(res.body.items.length).toBe(0);
  });

  let userId = "";
  it("should create a user", async () => {
    const res = await req
      .post(SETTINGS.PATHS.USERS)
      .set("Authorization", `Basic ${encodedCredentials}`)
      .send({
        login: "A8fkpfX_NB",
        password: "string",
        email: "example@example.com",
      });

    userId = res.body.id;

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("login");
    expect(res.body).toHaveProperty("email");
    expect(res.body).toHaveProperty("id");
    expect(res.body).toHaveProperty("createdAt");
  });

  it("should delete the user", async () => {
    const res = await req
      .delete(SETTINGS.PATHS.USERS + `/${userId}`)
      .set("Authorization", `Basic ${encodedCredentials}`);

    expect(res.status).toBe(204);
  });
});
