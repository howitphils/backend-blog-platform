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
  async loginUser(credentials: LoginInputModel): Promise<WithId<UserDbType>> {
    const { loginOrEmail, password } = credentials;

    const targetUser = await usersRepository.getUserByLoginOrEmail(
      loginOrEmail
    );

    if (!targetUser) {
      throw new CustomError("User does not exist", HttpStatuses.Unauthorized);
    }

    const isCorrect = await bcryptService.compareHash(
      password,
      targetUser.accountData.passHash
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
    const createdId = await usersService.createNewUser(user);
    const targetUser = await usersService.getUserById(createdId);

    const sendingResult = await emailManager.sendEmailForRegistration(
      targetUser.accountData.email,
      targetUser.emailConfirmation.confirmationCode
    );

    if (!sendingResult) {
      await usersService.deleteUser(targetUser._id);
      throw new CustomError(
        "Email was not sent, check input data",
        HttpStatuses.BadRequest
      );
    }
  },

  async confirmRegistration(code: string) {
    const targetUser = await usersRepository.getUserByConfirmationCode(code);

    if (!targetUser) {
      throw new CustomError(
        "Confirmation code is incorrect",
        HttpStatuses.BadRequest
      );
    }
    if (targetUser.emailConfirmation.expirationDate < new Date()) {
      throw new CustomError(
        "Confirmation code is already expired",
        HttpStatuses.BadRequest
      );
    }
    if (targetUser.emailConfirmation.isConfirmed) {
      throw new CustomError(
        "Email is already confirmed",
        HttpStatuses.BadRequest
      );
    }

    return usersRepository.updateIsConfirmedStatus(targetUser._id, true);
  },
  async resendConfirmationCode(email: string) {},
};
