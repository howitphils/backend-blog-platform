import { LoginInputModel, TokenPairType } from "../types/login-types";
import { UserInputModel } from "../types/users-types";
import { usersRepository } from "../db/mongodb/repositories/users-repository/users-db-repository";
import { ErrorWithStatusCode } from "../middlewares/error-handler";
import { HttpStatuses } from "../types/http-statuses";
import { bcryptService } from "../adapters/bcryptService";
import { usersService } from "./users-service";
import { emailManager } from "../managers/email-manager";
import { createErrorsObject } from "../routers/controllers/utils";
import { uuIdService } from "../adapters/uuIdService";
import { dateFnsService } from "../adapters/dateFnsService";
import { jwtService } from "../adapters/jwtService";
import { ResultObject, ResultStatus } from "../types/resultObject-types";
import { SETTINGS } from "../settings";

export const authService = {
  // Проверка на существование юзера для логина
  async loginUser(credentials: LoginInputModel): Promise<TokenPairType> {
    const { loginOrEmail, password } = credentials;

    const targetUser = await usersRepository.getUserByLoginOrEmail(
      loginOrEmail
    );

    if (!targetUser) {
      throw new ErrorWithStatusCode(
        "User does not exist",
        HttpStatuses.Unauthorized
      );
    }

    const isCorrect = await bcryptService.compareHash(
      password,
      targetUser.accountData.passHash
    );

    if (!isCorrect) {
      throw new ErrorWithStatusCode(
        "Incorrect user's credentials",
        HttpStatuses.Unauthorized
      );
    }

    if (!targetUser.emailConfirmation.isConfirmed) {
      throw new ErrorWithStatusCode(
        "User is not confirmed",
        HttpStatuses.Unauthorized
      );
    }

    const tokenPair = jwtService.createJwtPair(targetUser._id.toString());

    console.log(tokenPair);

    return tokenPair;
  },

  async logout(userId: string, token: string) {
    const user = await usersRepository.findUserByRefreshToken(token);

    if (user) {
      throw new ErrorWithStatusCode(
        "Token is already used",
        HttpStatuses.Unauthorized
      );
    }

    await usersRepository.addUsedTokenToBlacklist(userId, token);
  },

  async refreshTokens(userId: string, token: string): Promise<TokenPairType> {
    const user = await usersRepository.findUserByRefreshToken(token);

    if (user) {
      throw new ErrorWithStatusCode(
        "Token is already used",
        HttpStatuses.Unauthorized
      );
    }

    await usersRepository.addUsedTokenToBlacklist(userId, token);

    const tokenPair = jwtService.createJwtPair(userId);

    return tokenPair;
  },

  async registerUser(user: UserInputModel) {
    const createdId = await usersService.createNewUser(user, false);
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
      throw new ErrorWithStatusCode(
        "User is not found",
        HttpStatuses.BadRequest,
        createErrorsObject("code", "Confirmation code is incorrect")
      );
    }

    if (targetUser.emailConfirmation.expirationDate < new Date()) {
      throw new ErrorWithStatusCode(
        "Confirmation code is already expired",
        HttpStatuses.BadRequest,
        createErrorsObject("code", "Confirmation code is already expired")
      );
    }

    if (targetUser.emailConfirmation.isConfirmed) {
      throw new ErrorWithStatusCode(
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
      throw new ErrorWithStatusCode(
        "User with this email does not exist",
        HttpStatuses.BadRequest,
        createErrorsObject("email", "User with this email does not exist")
      );
    }

    if (user.emailConfirmation.isConfirmed) {
      throw new ErrorWithStatusCode(
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
      throw new ErrorWithStatusCode(
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

  checkAccessToken(token: string): ResultObject<string | null> {
    const [authType, accessToken] = token.split(" ");

    if (authType !== "Bearer") {
      const resultObject: ResultObject = {
        status: ResultStatus.Unauthorized,
        errorMessage: "Wrong auth type",
        extensions: [],
        data: null,
      };

      return resultObject;
    }

    const verifiedUser = jwtService.verifyToken(
      accessToken,
      SETTINGS.JWT_SECRET_ACCESS
    );

    if (!verifiedUser) {
      console.log("not verified");

      const resultObject: ResultObject = {
        status: ResultStatus.Unauthorized,
        errorMessage: "Token is not verified",
        extensions: [],
        data: null,
      };

      return resultObject;
    }

    return {
      status: ResultStatus.Success,
      extensions: [],
      data: verifiedUser.userId,
    };
  },
};
