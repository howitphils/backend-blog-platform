// import { db } from "./../src/db/mongodb/mongo";
import { SETTINGS } from "../src/settings";
import { createNewUserInDb, createUserDto, req } from "./test-helpers";
import { MongoClient } from "mongodb";
import { clearCollections, runDb } from "../src/db/mongodb/mongodb";

describe("/auth", () => {
  let client: MongoClient;

  beforeAll(async () => {
    client = await runDb(SETTINGS.MONGO_URL, SETTINGS.TEST_DB_NAME);
  });

  beforeEach(async () => {
    await clearCollections();
  });

  afterAll(async () => {
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
    await createNewUserInDb();

    await req
      .post(SETTINGS.PATHS.AUTH + "/login")
      .send({
        loginOrEmail: "random",
        password: "string",
      })
      .expect(401);
  });

  it("it should not login a user with incorrect input values", async () => {
    await createNewUserInDb();

    await req
      .post(SETTINGS.PATHS.AUTH + "/login")
      .send({
        loginOrEmail: 221,
        password: false,
      })
      .expect(400);
  });
});
