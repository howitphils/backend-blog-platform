import { WithId } from "mongodb";
import { LoginInputModel } from "../types/login-types";
import { UserDbType, UserInputModel } from "../types/users-types";
import { usersRepository } from "../db/mongodb/repositories/users-repository/users-db-repository";
import { CustomError } from "../middlewares/error-handler";
import { HttpStatuses } from "../types/http-statuses";
import { bcryptService } from "../adapters/bcryptService";
import { usersService } from "./users-service";
import { emailManager } from "../managers/email-manager";

export const authService = {
  // Проверка на существование юзера для логина
  async validateUser(
    credentials: LoginInputModel
  ): Promise<WithId<UserDbType>> {
    const { loginOrEmail, password } = credentials;

    const targetUser = await usersRepository.getUserByLoginOrEmail(
      loginOrEmail
    );

    if (!targetUser) {
      throw new CustomError("User does not exist", HttpStatuses.Unauthorized);
    }

    const isCorrect = await bcryptService.compareHash(
      password,
      targetUser.passHash
    );

    if (!isCorrect) {
      throw new CustomError(
        "Incorrect user's credentials",
        HttpStatuses.Unauthorized
      );
    }

    return targetUser;
  },

  async registerUser(user: UserInputModel) {
    await usersService.createNewUser(user);

    await emailManager.sendEmailForRegistration(user.email);
  },
  async confirmRegistration(code: string) {},
  async resendConfirmationCode(email: string) {},
};
