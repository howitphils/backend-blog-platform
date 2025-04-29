import { WithId } from "mongodb";
import { LoginInputModel } from "../types/login-types";
import { UserDbType, UserInputModel } from "../types/users-types";
import { usersRepository } from "../db/mongodb/repositories/users-repository/users-db-repository";
import {
  CustomError,
  CustomErrorWithObject,
} from "../middlewares/error-handler";
import { HttpStatuses } from "../types/http-statuses";
import { bcryptService } from "../adapters/bcryptService";
import { usersService } from "./users-service";
import { emailManager } from "../managers/email-manager";
import { createErrorsObject } from "../routers/controllers/utils";

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

    emailManager.sendEmailForRegistration(
      targetUser.accountData.email,
      targetUser.emailConfirmation.confirmationCode
    );
  },

  async confirmRegistration(code: string) {
    const targetUser = await usersRepository.getUserByConfirmationCode(code);

    if (!targetUser) {
      throw new CustomErrorWithObject(
        "User is not found",
        HttpStatuses.BadRequest,
        createErrorsObject("confirmationCode", "Confirmation code is incorrect")
      );
    }

    if (targetUser.emailConfirmation.confirmationCode !== code) {
      throw new CustomErrorWithObject(
        "Confirmation code is incorrect",
        HttpStatuses.BadRequest,
        createErrorsObject("confirmationCode", "Confirmation code is incorrect")
      );
    }

    if (targetUser.emailConfirmation.expirationDate < new Date()) {
      throw new CustomErrorWithObject(
        "Confirmation code is already expired",
        HttpStatuses.BadRequest,
        createErrorsObject(
          "confirmationCode",
          "Confirmation code is already expired"
        )
      );
    }
    if (targetUser.emailConfirmation.isConfirmed) {
      throw new CustomErrorWithObject(
        "Email is already confirmed",
        HttpStatuses.BadRequest,
        createErrorsObject("confirmationCode", "Email is already confirmed")
      );
    }

    return usersRepository.updateIsConfirmedStatus(targetUser._id, true);
  },

  async resendConfirmationCode(email: string) {
    const user = await usersRepository.getUserByLoginOrEmail(email);

    if (!user) {
      throw new CustomError(
        "User with this email does not exist",
        HttpStatuses.NotFound
      );
    }

    if (user.emailConfirmation.isConfirmed) {
      throw new CustomErrorWithObject(
        "User with this email already confirmed",
        HttpStatuses.BadRequest,
        createErrorsObject("email", "Email is already confirmed")
      );
    }

    emailManager
      .sendEmailForRegistration(email, user.emailConfirmation.confirmationCode)
      .catch((e) => console.log(e));
  },
};
