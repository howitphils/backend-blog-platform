import { MongoClient } from "mongodb";
import { runDb } from "../src/db/mongodb/mongodb";
import { SETTINGS } from "../src/settings";
import {
  basicAuth,
  createUserDto,
  defaultPagination,
  req,
} from "./test-helpers";

describe("/users", () => {
  let client: MongoClient;

  beforeAll(async () => {
    // Создаем новое тестовое соединение
    client = await runDb(SETTINGS.MONGO_URL, SETTINGS.TEST_DB_NAME);

    // Очищаем коллекции
    await req.delete(SETTINGS.PATHS.TESTS + "/all-data").expect(204);
  });

  afterAll(async () => {
    // Закрываем коннект с дб
    await client.close();
    console.log("Connection closed");
  });

  it("should return all users", async () => {
    const res = await req.get(SETTINGS.PATHS.USERS).set(basicAuth).expect(200);

    expect(res.body).toEqual(defaultPagination);
  });

  let userId = "";
  it("should create a user", async () => {
    const newUser = createUserDto({});

    const res = await req
      .post(SETTINGS.PATHS.USERS)
      .set(basicAuth)
      .send(newUser)
      .expect(201);

    userId = res.body.id;

    expect(res.body).toEqual({
      id: expect.any(String),
      login: newUser.login,
      email: newUser.email,
      createdAt: expect.any(String),
    });
  });

  it("should not create a user with duplicated login", async () => {
    const newUser = createUserDto({ email: "exadas@mail.ru" });

    const res = await req
      .post(SETTINGS.PATHS.USERS)
      .set(basicAuth)
      .send(newUser)
      .expect(400);

    expect(res.body).toEqual({
      errorsMessages: [
        {
          field: "login",
          message: expect.any(String),
        },
      ],
    });
  });

  it("should not create a user with duplicated email", async () => {
    const newUser = createUserDto({ login: "new-user2" });

    const res = await req
      .post(SETTINGS.PATHS.USERS)
      .set(basicAuth)
      .send(newUser)
      .expect(400);

    expect(res.body).toEqual({
      errorsMessages: [
        {
          field: "email",
          message: expect.any(String),
        },
      ],
    });
  });

  it("should delete the user", async () => {
    await req
      .delete(SETTINGS.PATHS.USERS + `/${userId}`)
      .set(basicAuth)
      .expect(204);
  });

  it("should not delete not existing user", async () => {
    await req
      .delete(SETTINGS.PATHS.USERS + "/22")
      .set(basicAuth)
      .expect(404);
  });
});
