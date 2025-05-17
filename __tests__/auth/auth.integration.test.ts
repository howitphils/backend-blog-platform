import { clearCollections, createUserDto } from "../test-helpers";
import { nodeMailerService } from "../../src/adapters/nodemailer-service";
import { authService } from "../../src/services/auth-service";
import { ErrorWithStatus } from "../../src/middlewares/error-handler";
import { runDb, usersCollection } from "../../src/db/mongodb/mongodb";
import { MongoClient } from "mongodb";
import { SETTINGS } from "../../src/settings";
import { HttpStatuses } from "../../src/types/http-statuses";
import { testSeeder } from "./auth.helpers";
import { uuIdService } from "../../src/adapters/uuIdService";
import { dateFnsService } from "../../src/adapters/dateFnsService";

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
        expect(error).toBeInstanceOf(ErrorWithStatus);
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

    it("should not confirm the email for not existing user and throw an error", async () => {
      try {
        await confirmEmailUseCase("asdczx");
        fail("Expected error to be thrown");
      } catch (error: any) {
        expect(error).toBeInstanceOf(ErrorWithStatus);
        expect(error).toHaveProperty("errorObj");
        expect(error.message).toBe("User is not found");
        expect(error.statusCode).toBe(HttpStatuses.BadRequest);
      }
    });

    it("should not confirm the email with expired code and throw an error", async () => {
      const { email, login, pass } = testSeeder.createUserDto({});
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
        expect(error).toBeInstanceOf(ErrorWithStatus);
        expect(error).toHaveProperty("errorObj");
        expect(error.message).toBe("Confirmation code is already expired");
        expect(error.statusCode).toBe(HttpStatuses.BadRequest);
      }
    });

    it("should not confirm already confirmed email and throw an error", async () => {
      const { email, login, pass } = testSeeder.createUserDto({});
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
        expect(error).toBeInstanceOf(ErrorWithStatus);
        expect(error).toHaveProperty("errorObj");
        expect(error.message).toBe("Email is already confirmed");
        expect(error.statusCode).toBe(HttpStatuses.BadRequest);
      }
    });

    it("should confirm the email", async () => {
      const { email, login, pass } = testSeeder.createUserDto({});
      const code = uuIdService.createRandomCode();

      await testSeeder.insertUser({
        email,
        login,
        pass,
        code,
      });

      expect(await confirmEmailUseCase(code)).toBe(true);
    });
  });

  describe("code resending", () => {
    afterAll(async () => {
      await clearCollections();
    });

    const codeResendingUseCase = authService.resendConfirmationCode;

    nodeMailerService.sendEmail = jest.fn().mockResolvedValue(true);

    it("should throw an error if user does not exist ", async () => {
      try {
        await codeResendingUseCase("random@gmail.com");
        fail("Expected error to be thrown");
      } catch (error: any) {
        expect(error).toBeInstanceOf(ErrorWithStatus);
        expect(error).toHaveProperty("errorObj");
        expect(error.message).toBe("User with this email does not exist");
        expect(error.statusCode).toBe(HttpStatuses.BadRequest);
      }
    });

    it("should throw an error if user is already confirmed", async () => {
      const { email, login, pass } = testSeeder.createUserDto({});
      const code = "test";

      await testSeeder.insertUser({
        email,
        login,
        pass,
        code,
        isConfirmed: true,
      });

      try {
        await codeResendingUseCase(email);
        fail("Expected error to be thrown");
      } catch (error: any) {
        expect(error).toBeInstanceOf(ErrorWithStatus);
        expect(error).toHaveProperty("errorObj");
        expect(error.message).toBe("User with this email is already confirmed");
        expect(error.statusCode).toBe(HttpStatuses.BadRequest);
      }
    });

    it("should throw an error if user is already confirmed", async () => {
      const { email, login, pass } = testSeeder.createUserDto({});
      const code = "test";

      await testSeeder.insertUser({
        email,
        login,
        pass,
        code,
        isConfirmed: true,
      });

      try {
        await codeResendingUseCase(email);
        fail("Expected error to be thrown");
      } catch (error: any) {
        expect(error).toBeInstanceOf(ErrorWithStatus);
        expect(error).toHaveProperty("errorObj");
        expect(error.message).toBe("User with this email is already confirmed");
        expect(error.statusCode).toBe(HttpStatuses.BadRequest);
      }
    });

    it("should update user's code and expiration date and send an email with code", async () => {
      const { email, login, pass } = testSeeder.createUserDto({
        email: "someemail@gmail.com",
      });
      const startCode = uuIdService.createRandomCode();
      const startExpirationDate = dateFnsService.addToCurrentDate();

      await testSeeder.insertUser({
        email,
        login,
        pass,
        code: startCode,
        expirationDate: startExpirationDate,
      });

      await codeResendingUseCase(email);

      const updatedUser = await usersCollection.findOne({
        "accountData.email": { $regex: email, $options: "i" },
      });

      expect(updatedUser?.emailConfirmation.confirmationCode).not.toBe(
        startCode
      );
      expect(updatedUser?.emailConfirmation.expirationDate).not.toBe(
        startExpirationDate
      );
      expect(nodeMailerService.sendEmail).toHaveBeenCalledTimes(2);
    });
  });
});
