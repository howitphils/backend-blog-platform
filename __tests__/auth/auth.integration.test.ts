import { clearCollections, createUserDto } from "../test-helpers";
import { nodeMailerService } from "../../src/adapters/nodemailer-service";
import { authService } from "../../src/services/auth-service";
import { CustomErrorWithObject } from "../../src/middlewares/error-handler";
import { runDb, usersCollection } from "../../src/db/mongodb/mongodb";
import { MongoClient } from "mongodb";
import { SETTINGS } from "../../src/settings";
import { HttpStatuses } from "../../src/types/http-statuses";
import { testSeeder } from "./auth.helpers";
import { uuIdService } from "../../src/adapters/uuIdService";

describe("/auth", () => {
  let client: MongoClient;

  beforeAll(async () => {
    client = await runDb(SETTINGS.MONGO_URL, SETTINGS.TEST_DB_NAME);
  });

  afterAll(async () => {
    await client.close();
    console.log("Connection closed");
  });

  describe("registration", () => {
    afterAll(async () => {
      await clearCollections();
    });

    nodeMailerService.sendEmail = jest.fn().mockResolvedValue(true);

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

      try {
        await registerUserUseCase(userDto);
        fail("Expected error to be thrown");
      } catch (error: any) {
        expect(error).toBeInstanceOf(CustomErrorWithObject);
        expect(error).toHaveProperty("errorObj");
        expect(error.message).toBe("User already exists");
        expect(error.statusCode).toBe(HttpStatuses.BadRequest);
      }

      const usersCount = await usersCollection.countDocuments();

      expect(nodeMailerService.sendEmail).toHaveBeenCalledTimes(1);
      expect(usersCount).toBe(1);
    });
  });

  describe("confirm registration", () => {
    afterAll(async () => {
      await clearCollections();
    });

    const confirmEmailUseCase = authService.confirmRegistration;

    it("should not confirm the email for not existing user", async () => {
      try {
        await confirmEmailUseCase("asdczx");
        fail("Expected error to be thrown");
      } catch (error: any) {
        expect(error).toBeInstanceOf(CustomErrorWithObject);
        expect(error).toHaveProperty("errorObj");
        expect(error.message).toBe("User is not found");
        expect(error.statusCode).toBe(HttpStatuses.BadRequest);
      }
    });

    it("should not confirm the email with expired code", async () => {
      const { email, login, pass } = testSeeder.createUserDto();
      const code = uuIdService.createRandomCode();

      await testSeeder.insertUser({
        email,
        login,
        pass,
        code,
        expirationDate: new Date(),
        isConfirmed: true,
      });

      try {
        await confirmEmailUseCase(code);
        fail("Expected error to be thrown");
      } catch (error: any) {
        expect(error).toBeInstanceOf(CustomErrorWithObject);
        expect(error).toHaveProperty("errorObj");
        expect(error.message).toBe("Confirmation code is already expired");
        expect(error.statusCode).toBe(HttpStatuses.BadRequest);
      }
    });

    it("should not confirm already confirmed email", async () => {
      const { email, login, pass } = testSeeder.createUserDto();
      const code = uuIdService.createRandomCode();

      await testSeeder.insertUser({
        email,
        login,
        pass,
        code,
        isConfirmed: true,
      });

      try {
        await confirmEmailUseCase(code);
        fail("Expected error to be thrown");
      } catch (error: any) {
        expect(error).toBeInstanceOf(CustomErrorWithObject);
        expect(error).toHaveProperty("errorObj");
        expect(error.message).toBe("Email is already confirmed");
        expect(error.statusCode).toBe(HttpStatuses.BadRequest);
      }
    });

    it("should confirm the email", async () => {
      const { email, login, pass } = testSeeder.createUserDto();
      const code = uuIdService.createRandomCode();

      await testSeeder.insertUser({
        email,
        login,
        pass,
        code,
      });

      const res = await confirmEmailUseCase(code);

      expect(res).toBe(true);
    });
  });
});
