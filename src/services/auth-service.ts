import { TokenPairType, UserInfoType } from "../types/login-types";
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
import { JwtPayloadRefresh, jwtService } from "../adapters/jwtService";
import { ResultObject, ResultStatus } from "../types/resultObject-types";
import { SessionDbType } from "../types/sessions-types";
import { sessionsRepository } from "../db/mongodb/repositories/sessions-repository/session-repository";

export const authService = {
  async loginUser(userInfo: UserInfoType): Promise<TokenPairType> {
    //TODO: 1) ищем юзера по кредам
    //      2) если юзер есть - создаем токены
    //      3) проверяем есть ли существующая сессия для этого девайса(??)
    //      4) создаем новую сессию для девайса

    const { loginOrEmail, password } = userInfo.usersCredentials;
    const { device_name, ip } = userInfo.usersConfigs;

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

    const deviceId = uuIdService.createRandomCode();

    const tokenPair = jwtService.createJwtPair(
      targetUser._id.toString(),
      deviceId
    );

    const { userId, exp, iat } = jwtService.decodeToken(
      tokenPair.refreshToken
    ) as JwtPayloadRefresh;

    const newSession: SessionDbType = {
      deviceId,
      userId,
      exp: exp as number,
      iat: iat as number,
      device_name,
      ip,
    };

    await sessionsRepository.createSession(newSession);

    return tokenPair;
  },

  async logout(userId: string, deviceId: string) {
    // TODO: 1) находим сессию по юзерИд и девайсИд
    //       2) если есть - удаляем

    const targetSession = await sessionsRepository.findByUserIdAndDeviceId(
      userId,
      deviceId
    );

    if (!targetSession) {
      throw new ErrorWithStatusCode(
        "Session is not found",
        HttpStatuses.NotFound
      );
    }

    //TODO: удалить сессию из коллекции
    const result = await sessionsRepository.deleteSession(userId, deviceId);
    console.log(result);
  },

  async refreshTokens(
    userId: string,
    deviceId: string,
    issuedAt: number
  ): Promise<TokenPairType> {
    //TODO : 1) проверить наличие сессии по юзерИд + девайсИд
    //       2) сравнить время выдачи сессии с полученным из контроллера
    //       2) в случае успеха - создать новые токены
    //       3) обновить время выдачи токена в сессии

    const session = await sessionsRepository.findByUserIdAndDeviceId(
      userId,
      deviceId
    );

    if (!session) {
      throw new ErrorWithStatusCode(
        "Session is not found",
        HttpStatuses.NotFound
      );
    }

    if (session.iat !== issuedAt) {
      throw new ErrorWithStatusCode(
        "Token is not valid",
        HttpStatuses.Unauthorized
      );
    }

    const tokenPair = jwtService.createJwtPair(userId, deviceId);

    const { exp, iat } = jwtService.decodeToken(
      tokenPair.refreshToken
    ) as JwtPayloadRefresh;

    await sessionsRepository.updateSessionIatAndExp(userId, deviceId, iat, exp);

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

    const verifiedUser = jwtService.verifyAccessToken(accessToken);

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
