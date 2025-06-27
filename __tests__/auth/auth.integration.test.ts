import { clearCollections, createUserDto, req } from "../test-helpers";

import { ErrorWithStatusCode } from "../../src/middlewares/error-handler";
import { runDb, usersCollection } from "../../src/db/mongodb/mongodb";
import { MongoClient } from "mongodb";
import { APP_CONFIG } from "../../src/settings";
import { HttpStatuses } from "../../src/types/http-statuses";
import { testSeeder } from "./auth.helpers";
import { UserDbType } from "../../src/types/users-types";
import {
  authService,
  dateFnsService,
  nodeMailerService,
  uuIdService,
} from "../../src/composition-root";

describe("/auth", () => {
  let client: MongoClient;

  beforeAll(async () => {
    client = await runDb(APP_CONFIG.MONGO_URL, APP_CONFIG.TEST_DB_NAME);

    nodeMailerService.sendEmail = jest.fn().mockResolvedValue(true);
  });

  afterAll(async () => {
    await client.close();
    console.log("Connection closed");
  });

  describe("registration", () => {
    afterAll(async () => {
      await clearCollections();
    });

    const registerUserUseCase = authService.registerUser.bind(authService);

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
        expect(error).toBeInstanceOf(ErrorWithStatusCode);
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

    const confirmEmailUseCase =
      authService.confirmRegistration.bind(authService);

    it("should not confirm the email for not existing user and throw an error", async () => {
      try {
        await confirmEmailUseCase("asdczx");
        fail("Expected error to be thrown");
      } catch (error: any) {
        expect(error).toBeInstanceOf(ErrorWithStatusCode);
        expect(error).toHaveProperty("errorObj");
        expect(error.message).toBe("User is not found");
        expect(error.statusCode).toBe(HttpStatuses.BadRequest);
      }
    });

    it("should not confirm the email with expired code and throw an error", async () => {
      const { email, login, pass } = testSeeder.createUserDto({});
      const confirmationCode = uuIdService.createRandomCode();

      await testSeeder.insertUser({
        email,
        login,
        pass,
        confirmationCode,
        expirationDate: new Date(),
        isConfirmed: true,
      });

      try {
        await confirmEmailUseCase(confirmationCode);
        fail("Expected error to be thrown");
      } catch (error: any) {
        expect(error).toBeInstanceOf(ErrorWithStatusCode);
        expect(error).toHaveProperty("errorObj");
        expect(error.message).toBe("Confirmation code is already expired");
        expect(error.statusCode).toBe(HttpStatuses.BadRequest);
      }
    });

    it("should not confirm already confirmed email and throw an error", async () => {
      const { email, login, pass } = testSeeder.createUserDto({});
      const confirmationCode = uuIdService.createRandomCode();

      await testSeeder.insertUser({
        email,
        login,
        pass,
        confirmationCode,
        isConfirmed: true,
      });

      try {
        await confirmEmailUseCase(confirmationCode);
        fail("Expected error to be thrown");
      } catch (error: any) {
        expect(error).toBeInstanceOf(ErrorWithStatusCode);
        expect(error).toHaveProperty("errorObj");
        expect(error.message).toBe("Email is already confirmed");
        expect(error.statusCode).toBe(HttpStatuses.BadRequest);
      }
    });

    it("should confirm the email", async () => {
      const { email, login, pass } = testSeeder.createUserDto({});
      const confirmationCode = uuIdService.createRandomCode();

      await testSeeder.insertUser({
        email,
        login,
        pass,
        confirmationCode,
      });

      expect(await confirmEmailUseCase(confirmationCode)).toBeTruthy();
    });
  });

  describe("confirmationCode resending", () => {
    afterAll(async () => {
      await clearCollections();
    });

    const codeResendingUseCase =
      authService.resendConfirmationCode.bind(authService);

    nodeMailerService.sendEmail = jest.fn().mockResolvedValue(true);

    it("should throw an error if user does not exist ", async () => {
      try {
        await codeResendingUseCase("random@gmail.com");
        fail("Expected error to be thrown");
      } catch (error: any) {
        expect(error).toBeInstanceOf(ErrorWithStatusCode);
        expect(error).toHaveProperty("errorObj");
        expect(error.message).toBe("User with this email does not exist");
        expect(error.statusCode).toBe(HttpStatuses.BadRequest);
      }
    });

    it("should throw an error if user is already confirmed", async () => {
      const { email, login, pass } = testSeeder.createUserDto({});
      const confirmationCode = "test";

      await testSeeder.insertUser({
        email,
        login,
        pass,
        confirmationCode,
        isConfirmed: true,
      });

      try {
        await codeResendingUseCase(email);
        fail("Expected error to be thrown");
      } catch (error: any) {
        expect(error).toBeInstanceOf(ErrorWithStatusCode);
        expect(error).toHaveProperty("errorObj");
        expect(error.message).toBe("User with this email is already confirmed");
        expect(error.statusCode).toBe(HttpStatuses.BadRequest);
      }
    });

    it("should throw an error if user is already confirmed", async () => {
      const { email, login, pass } = testSeeder.createUserDto({});
      const confirmationCode = "test";

      await testSeeder.insertUser({
        email,
        login,
        pass,
        confirmationCode,
        isConfirmed: true,
      });

      try {
        await codeResendingUseCase(email);
        fail("Expected error to be thrown");
      } catch (error: any) {
        expect(error).toBeInstanceOf(ErrorWithStatusCode);
        expect(error).toHaveProperty("errorObj");
        expect(error.message).toBe("User with this email is already confirmed");
        expect(error.statusCode).toBe(HttpStatuses.BadRequest);
      }
    });

    it("should update user's confirmationCode and expiration date and send an email with confirmationCode", async () => {
      const { email, login, pass } = testSeeder.createUserDto({
        email: "someemail@gmail.com",
      });
      const startCode = uuIdService.createRandomCode();
      const startExpirationDate = dateFnsService.addToCurrentDate();

      await testSeeder.insertUser({
        email,
        login,
        pass,
        confirmationCode: startCode,
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

  describe("refresh token", () => {
    afterAll(async () => {
      await clearCollections();
    });

    const refreshTokensUseCase = authService.refreshTokens.bind(authService);
    it("should get an error if session does not exist", async () => {
      try {
        await refreshTokensUseCase({
          userId: "userId",
          deviceId: "deviceId",
          issuedAt: 120,
        });
        fail("Error expected");
      } catch (error: any) {
        expect(error).toBeInstanceOf(ErrorWithStatusCode);
        expect(error.message).toBe("Session is not found");
        expect(error.statusCode).toBe(HttpStatuses.Unauthorized);
      }
    });
  });
  describe("logout", () => {
    afterAll(async () => {
      await clearCollections();
    });

    const logoutUseCase = authService.logout.bind(authService);
    it("should get an error if session does not exist", async () => {
      try {
        await logoutUseCase({
          userId: "userId",
          deviceId: "deviceId",
          issuedAt: 112,
        });
        fail("Error exprected");
      } catch (error: any) {
        expect(error).toBeInstanceOf(ErrorWithStatusCode);
        expect(error.message).toBe("Session is not found");
        expect(error.statusCode).toBe(HttpStatuses.Unauthorized);
      }
    });
  });

  describe("password recovery", () => {
    afterAll(async () => {
      await clearCollections();
    });

    it("should send an email even if user is not registered", async () => {
      jest.resetAllMocks();

      await req
        .post(
          APP_CONFIG.MAIN_PATHS.AUTH +
            APP_CONFIG.ENDPOINT_PATHS.AUTH.PASSWORD_RECOVERY
        )
        .send({ email: "some@email.com" })
        .expect(HttpStatuses.NoContent);

      expect(nodeMailerService.sendEmail).toHaveBeenCalledTimes(1);
    });
  });

  describe("password recovery confirmation", () => {
    afterAll(async () => {
      await clearCollections();
    });

    it("should update the password", async () => {
      const { email, login, pass } = testSeeder.createUserDto({});
      // закинет pass как passHash в бд
      await testSeeder.insertUser({
        email,
        login,
        pass,
        recoveryCode: "correct_code",
      });

      await req
        .post(
          APP_CONFIG.MAIN_PATHS.AUTH +
            APP_CONFIG.ENDPOINT_PATHS.AUTH.CONFIRM_PASSWORD_RECOVERY
        )
        .send({ newPassword: "new_password", recoveryCode: "correct_code" })
        .expect(HttpStatuses.NoContent);

      const updatedUser = (await usersCollection.findOne({
        "accountData.email": email,
      })) as UserDbType;

      expect(pass).not.toBe(updatedUser.accountData.passHash);
    });

    const confirmPasswordRecoveryUseCase =
      authService.confirmPasswordRecovery.bind(authService);

    it("should return an error if recovery code is incorrect", async () => {
      try {
        await confirmPasswordRecoveryUseCase("123456", "incorrect_code");
        fail("Error exprected");
      } catch (error: any) {
        expect(error).toBeInstanceOf(ErrorWithStatusCode);
        expect(error.message).toBe(
          APP_CONFIG.ERROR_MESSAGES.RECOVERY_CODE_IS_INCORRECT
        );
        expect(error.statusCode).toBe(HttpStatuses.BadRequest);
      }
    });

    it("should return an error if recovery code has been expired", async () => {
      const { email, login, pass } = testSeeder.createUserDto({
        email: "new_email@mail.com",
        login: "uniqueLogin",
      });
      await testSeeder.insertUser({
        email,
        login,
        pass,
        recoveryCode: "some_code",
        recoveryCodeExpirationDate: dateFnsService.rollBackBySeconds(10),
      });

      try {
        await confirmPasswordRecoveryUseCase("123456", "some_code");
        fail("Error exprected");
      } catch (error: any) {
        expect(error).toBeInstanceOf(ErrorWithStatusCode);
        expect(error.message).toBe(
          APP_CONFIG.ERROR_MESSAGES.RECOVERY_CODE_IS_EXPIRED
        );
        expect(error.statusCode).toBe(HttpStatuses.BadRequest);
      }
    });
  });
});
