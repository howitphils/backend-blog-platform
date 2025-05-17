import { WithId } from "mongodb";
import { LoginInputModel } from "../types/login-types";
import { UserDbType, UserInputModel } from "../types/users-types";
import { usersRepository } from "../db/mongodb/repositories/users-repository/users-db-repository";
import { ErrorWithStatus } from "../middlewares/error-handler";
import { HttpStatuses } from "../types/http-statuses";
import { bcryptService } from "../adapters/bcryptService";
import { usersService } from "./users-service";
import { emailManager } from "../managers/email-manager";
import { createErrorsObject } from "../routers/controllers/utils";
import { uuIdService } from "../adapters/uuIdService";
import { dateFnsService } from "../adapters/dateFnsService";

export const authService = {
  // Проверка на существование юзера для логина
  async loginUser(credentials: LoginInputModel): Promise<WithId<UserDbType>> {
    const { loginOrEmail, password } = credentials;

    const targetUser = await usersRepository.getUserByLoginOrEmail(
      loginOrEmail
    );

    if (!targetUser) {
      throw new ErrorWithStatus(
        "User does not exist",
        HttpStatuses.Unauthorized
      );
    }

    const isCorrect = await bcryptService.compareHash(
      password,
      targetUser.accountData.passHash
    );

    if (!isCorrect) {
      throw new ErrorWithStatus(
        "Incorrect user's credentials",
        HttpStatuses.Unauthorized
      );
    }

    return targetUser;
  },

  async registerUser(user: UserInputModel) {
    const createdId = await usersService.createNewUser(user);
    const targetUser = await usersService.getUserById(createdId);

    emailManager
      .sendEmailForRegistration(
        targetUser.accountData.email,
        targetUser.emailConfirmation.confirmationCode
      )
      .catch((e) => console.log(e));
  },

  async confirmRegistration(code: string): Promise<boolean> {
    const targetUser = await usersRepository.getUserByConfirmationCode(code);

    if (!targetUser) {
      throw new ErrorWithStatus(
        "User is not found",
        HttpStatuses.BadRequest,
        createErrorsObject("code", "Confirmation code is incorrect")
      );
    }

    if (targetUser.emailConfirmation.expirationDate < new Date()) {
      throw new ErrorWithStatus(
        "Confirmation code is already expired",
        HttpStatuses.BadRequest,
        createErrorsObject("code", "Confirmation code is already expired")
      );
    }
    if (targetUser.emailConfirmation.isConfirmed) {
      throw new ErrorWithStatus(
        "Email is already confirmed",
        HttpStatuses.BadRequest,
        createErrorsObject("code", "Email is already confirmed")
      );
    }

    return usersRepository.updateIsConfirmedStatus(targetUser._id, true);
  },

  async resendConfirmationCode(email: string) {
    const user = await usersRepository.getUserByLoginOrEmail(email);

    if (!user) {
      throw new ErrorWithStatus(
        "User with this email does not exist",
        HttpStatuses.BadRequest,
        createErrorsObject("email", "User with this email does not exist")
      );
    }

    if (user.emailConfirmation.isConfirmed) {
      throw new ErrorWithStatus(
        "User with this email is already confirmed",
        HttpStatuses.BadRequest,
        createErrorsObject("email", "Email is already confirmed")
      );
    }

    await usersRepository.updateConfirmationCodeAndExpirationDate(
      user._id,
      uuIdService.createRandomCode(),
      dateFnsService.addToCurrentDate()
    );

    const updatedUser = await usersRepository.getUserByLoginOrEmail(email);

    if (!updatedUser) {
      throw new ErrorWithStatus(
        "Updated user was not found",
        HttpStatuses.NotFound
      );
    }

    emailManager
      .sendEmailForRegistration(
        email,
        updatedUser.emailConfirmation.confirmationCode
      )
      .catch((e) => console.log(e));
  },
};
