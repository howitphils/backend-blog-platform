import { db } from "./../src/db/mongodb/mongo";
import { SETTINGS } from "../src/settings";
import {
  basicAuth,
  createNewUserInDb,
  createUserDto,
  defaultPagination,
  req,
} from "./test-helpers";

describe("/users", () => {
  beforeAll(async () => {
    await db.run(SETTINGS.MONGO_URL);
  });

  beforeEach(async () => {
    await db.clear(SETTINGS.TEST_DB_NAME);
  });

  afterAll(async () => {
    await db.close();
    console.log("Connection closed");
  });

  // describe("get Users", () => {
  //   beforeAll(async () => {
  //     await createUsersInDb(10);
  //   });

  //   afterAll(async () => {
  //     await req.delete(SETTINGS.PATHS.TESTS + "/all-data").expect(204);
  //   });

  //   it("should return all users", async () => {
  //     const res = await req
  //       .get(SETTINGS.PATHS.USERS + "?pageNumber=2&pageSize=2")
  //       .set(basicAuth)
  //       .expect(200);

  //     expect(res.body).toEqual({
  //       pagesCount: 0,
  //       page: 1,
  //       pageSize: 10,
  //       totalCount: 0,
  //       items: [],
  //     });
  //   });
  // });

  it("should return all users", async () => {
    const res = await req.get(SETTINGS.PATHS.USERS).set(basicAuth).expect(200);

    expect(res.body).toEqual(defaultPagination);
  });

  it("should create a user", async () => {
    const newUserDto = createUserDto({});

    const res = await req
      .post(SETTINGS.PATHS.USERS)
      .set(basicAuth)
      .send(newUserDto)
      .expect(201);

    expect(res.body).toEqual({
      id: expect.any(String),
      login: newUserDto.login,
      email: newUserDto.email,
      createdAt: expect.any(String),
    });
  });

  it("should not create a user with duplicated login", async () => {
    const newUserDto = createUserDto({ email: "exadas@mail.ru" });

    const res = await req
      .post(SETTINGS.PATHS.USERS)
      .set(basicAuth)
      .send(newUserDto)
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
    const newUserDto = createUserDto({ login: "new-user2" });

    const res = await req
      .post(SETTINGS.PATHS.USERS)
      .set(basicAuth)
      .send(newUserDto)
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

  it("should not create a user with incorrect login", async () => {
    const newUserDto = createUserDto({ login: "" });

    const res = await req
      .post(SETTINGS.PATHS.USERS)
      .set(basicAuth)
      .send(newUserDto)
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

  it("should not create a user with incorrect email", async () => {
    const newUserDto = createUserDto({ email: "" });

    const res = await req
      .post(SETTINGS.PATHS.USERS)
      .set(basicAuth)
      .send(newUserDto)
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
    const newUser = await createNewUserInDb();
    await req
      .delete(SETTINGS.PATHS.USERS + `/${newUser.id}`)
      .set(basicAuth)
      .expect(204);
  });

  it("should not delete not existing user", async () => {
    const newUser = await createNewUserInDb();

    await req
      .delete(SETTINGS.PATHS.USERS + `/${newUser.id + 22}`)
      .set(basicAuth)
      .expect(404);
  });
});
