import { MongoClient } from "mongodb";
import { runDb } from "../src/db/mongodb/mongodb";
import { SETTINGS } from "../src/settings";
import { req } from "./test-helpers";
import { encodedCredentials } from "../src/middlewares/auth-validator";

describe("/auth", () => {
  let client: MongoClient;

  beforeAll(async () => {
    // Создаем новое тестовое соединение
    client = await runDb(SETTINGS.MONGO_URL, SETTINGS.TEST_DB_NAME);

    const res = await req
      .post(SETTINGS.PATHS.USERS)
      .set("Authorization", `Basic ${encodedCredentials}`)
      .send({
        login: "new-user",
        password: "string",
        email: "example@example.com",
      });

    expect(res.status).toBe(201);
  });

  afterAll(async () => {
    // Закрываем коннект с дб
    await client.close();
    console.log("Connection closed");
  });

  it("it should login a correct user", async () => {
    const res = await req.post(SETTINGS.PATHS.AUTH + "/login").send({
      loginOrEmail: "new-user",
      password: "string",
    });

    expect(res.status).toBe(204);
  });

  it("it should not login a not existing user", async () => {
    const res = await req.post(SETTINGS.PATHS.AUTH + "/login").send({
      loginOrEmail: "incorrect",
      password: "string",
    });

    expect(res.status).toBe(401);
  });

  it("it should not login a user with incorrect input values", async () => {
    const res = await req.post(SETTINGS.PATHS.AUTH + "/login").send({
      loginOrEmail: 221,
      password: false,
    });

    expect(res.status).toBe(400);
  });
});
