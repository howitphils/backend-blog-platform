import { HttpStatuses } from "./../src/types/http-statuses";
// import { db } from "./../src/db/mongodb/mongo";
import { SETTINGS } from "../src/settings";
import {
  createNewUserInDb,
  createUserDto,
  getAccessToken,
  jwtAuth,
  req,
} from "./test-helpers";
import { MongoClient } from "mongodb";
import {
  clearCollections,
  runDb,
  usersCollection,
} from "../src/db/mongodb/mongodb";
import { nodeMailerService } from "../src/adapters/nodemailer-service";
import { authService } from "../src/services/auth-service";
import { CustomErrorWithObject } from "../src/middlewares/error-handler";

describe("/auth", () => {
  let client: MongoClient;

  beforeAll(async () => {
    client = await runDb(SETTINGS.MONGO_URL, SETTINGS.TEST_DB_NAME);
  });

  afterAll(async () => {
    await client.close();
    console.log("Connection closed");
  });

  describe("login", () => {
    afterAll(async () => {
      await clearCollections();
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
        .expect(HttpStatuses.Success);

      expect(res.body).toEqual({
        accessToken: expect.any(String),
      });
    });

    it("it should not login a not existing user", async () => {
      await req
        .post(SETTINGS.PATHS.AUTH + "/login")
        .send({
          loginOrEmail: "random",
          password: "string",
        })
        .expect(HttpStatuses.Unauthorized);
    });

    it("it should not login a user with incorrect input values", async () => {
      await req
        .post(SETTINGS.PATHS.AUTH + "/login")
        .send({
          loginOrEmail: 221,
          password: false,
        })
        .expect(HttpStatuses.BadRequest);
    });
  });

  describe("me", () => {
    afterAll(async () => {
      await clearCollections();
    });

    it("should return user's info", async () => {
      const token = await getAccessToken();

      const res = await req
        .get(SETTINGS.PATHS.AUTH + "/me")
        .set(jwtAuth(token))
        .expect(HttpStatuses.Success);

      expect(res.body).toEqual({
        email: "example@gmail.com",
        login: "new-user",
        userId: expect.any(String),
      });
    });

    it("should not return user's info for unauthorized user", async () => {
      await req
        .get(SETTINGS.PATHS.AUTH + "/me")
        .expect(HttpStatuses.Unauthorized);
    });
  });

  describe("registration", () => {
    afterAll(async () => {
      await clearCollections();
    });

    nodeMailerService.sendEmail = jest
      .fn()
      .mockImplementation(() => Promise.resolve(true));

    const registerUserUseCase = authService.registerUser;

    it("should accept user's data and send an email", async () => {
      const userDto = createUserDto({});

      await registerUserUseCase(userDto);

      const usersCount = await usersCollection.countDocuments();

      expect(nodeMailerService.sendEmail).toHaveBeenCalledTimes(1);
      expect(usersCount).toBe(1);
    });

    it("should not register a user twice with an error", async () => {
      const userDto = createUserDto({});

      await expect(registerUserUseCase(userDto)).rejects.toThrow(
        CustomErrorWithObject
      );

      const usersCount = await usersCollection.countDocuments();

      expect(nodeMailerService.sendEmail).toHaveBeenCalledTimes(1);
      expect(usersCount).toBe(1);
    });
  });
});
