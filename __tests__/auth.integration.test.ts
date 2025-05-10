import { clearCollections, createUserDto } from "./test-helpers";
import { nodeMailerService } from "../src/adapters/nodemailer-service";
import { authService } from "../src/services/auth-service";
import { CustomErrorWithObject } from "../src/middlewares/error-handler";
import { usersCollection } from "../src/db/mongodb/mongodb";

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

  it("should confirm the email", () => {});
});
