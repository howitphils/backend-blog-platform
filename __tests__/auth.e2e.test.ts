import { MongoClient } from "mongodb";
import { runDb } from "../src/db/mongodb/mongodb";
import { SETTINGS } from "../src/settings";
import { createNewUserInDb, createUserDto, req } from "./test-helpers";

describe("/auth", () => {
  let client: MongoClient;

  beforeAll(async () => {
    // Создаем новое тестовое соединение
    client = await runDb(SETTINGS.MONGO_URL, SETTINGS.TEST_DB_NAME);

    await req.delete(SETTINGS.PATHS.TESTS + "/all-data").expect(204);
  });

  afterEach(async () => {
    await req.delete(SETTINGS.PATHS.TESTS + "/all-data").expect(204);
  });

  afterAll(async () => {
    // Закрываем коннект с бд
    await client.close();
    console.log("Connection closed");
  });

  it("it should login a correct user", async () => {
    const newUser = createUserDto({});
    await createNewUserInDb(newUser);

    const res = await req
      .post(SETTINGS.PATHS.AUTH + "/login")
      .send({
        loginOrEmail: newUser.login,
        password: newUser.password,
      })
      .expect(200);

    expect(res.body).toEqual({
      accessToken: expect.any(String),
    });
  });

  it("it should not login a not existing user", async () => {
    const newUser = createUserDto({});
    await createNewUserInDb(newUser);

    await req
      .post(SETTINGS.PATHS.AUTH + "/login")
      .send({
        loginOrEmail: "incorrect",
        password: "string",
      })
      .expect(401);
  });

  it("it should not login a user with incorrect input values", async () => {
    const newUser = createUserDto({});
    await createNewUserInDb(newUser);

    const res = await req.post(SETTINGS.PATHS.AUTH + "/login").send({
      loginOrEmail: 221,
      password: false,
    });

    expect(res.status).toBe(400);
  });
});
