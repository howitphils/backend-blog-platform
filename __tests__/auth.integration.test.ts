import { clearCollections, createUserDto } from "./test-helpers";
import { nodeMailerService } from "../src/adapters/nodemailer-service";
import { authService } from "../src/services/auth-service";
import { CustomErrorWithObject } from "../src/middlewares/error-handler";
import { runDb, usersCollection } from "../src/db/mongodb/mongodb";
import { MongoClient } from "mongodb";
import { SETTINGS } from "../src/settings";

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

      await expect(registerUserUseCase(userDto)).rejects.toThrow(
        CustomErrorWithObject
      );

      const usersCount = await usersCollection.countDocuments();

      expect(nodeMailerService.sendEmail).toHaveBeenCalledTimes(1);
      expect(usersCount).toBe(1);
    });
  });

  describe("email confirmation", () => {
    afterAll(async () => {
      await clearCollections();
    });

    const confirmEmailUseCase = authService.confirmRegistration;

    it("should not confirm the email for not existing user", async () => {
      await expect(confirmEmailUseCase("asds")).rejects.toThrow(
        CustomErrorWithObject
      );
    });

    it("should not confirm the email with expired code", async () => {
      await expect(confirmEmailUseCase("asds")).rejects.toThrow(
        CustomErrorWithObject
      );
    });
  });
});
