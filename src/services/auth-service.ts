import {
  RefreshTokensAndLogoutDto,
  TokenPairType,
  UserInfoType,
} from "../types/login-types";
import { UserInputModel } from "../types/users-types";
import { UsersRepository } from "../db/mongodb/repositories/users-repository/users-db-repository";
import { ErrorWithStatusCode } from "../middlewares/error-handler";
import { HttpStatuses } from "../types/http-statuses";
import { BcryptService } from "../adapters/bcryptService";
import { createErrorsObject } from "../routers/controllers/utils";
import { JwtPayloadRefresh, JwtService } from "../adapters/jwtService";
import { ResultObject, ResultStatus } from "../types/resultObject-types";
import { SessionDbType } from "../types/sessions-types";
import { SessionRepository } from "../db/mongodb/repositories/sessions-repository/session-repository";
import { APP_CONFIG } from "../settings";
import { EmailManager } from "../managers/email-manager";
import { UsersService } from "./users-service";
import { inject, injectable } from "inversify";
import { uuidService } from "../adapters/uuIdService";

@injectable()
export class AuthService {
  constructor(
    @inject(UsersRepository)
    private usersRepository: UsersRepository,

    @inject(SessionRepository)
    private sessionsRepository: SessionRepository,

    @inject(UsersService)
    private usersService: UsersService,

    @inject(BcryptService)
    private bcryptService: BcryptService,

    @inject(JwtService)
    private jwtService: JwtService,

    @inject(EmailManager)
    private emailManager: EmailManager
  ) {}

  async loginUser(dto: UserInfoType): Promise<TokenPairType> {
    const { loginOrEmail, password } = dto.usersCredentials;
    const { device_name, ip } = dto.usersConfigs;

    const targetUser = await this.usersRepository.getUserByLoginOrEmail(
      loginOrEmail
    );

    if (!targetUser) {
      throw new ErrorWithStatusCode(
        APP_CONFIG.ERROR_MESSAGES.USER_NOT_FOUND,
        HttpStatuses.Unauthorized
      );
    }

    const isCorrect = await this.bcryptService.compareHash(
      password,
      targetUser.accountData.passHash
    );

    if (!isCorrect) {
      throw new ErrorWithStatusCode(
        APP_CONFIG.ERROR_MESSAGES.INCORRECT_CREDENTIALS,
        HttpStatuses.Unauthorized
      );
    }

    const deviceId = uuidService.createRandomCode();

    const tokenPair = this.jwtService.createJwtPair(
      targetUser._id.toString(),
      deviceId
    );

    const { userId, exp, iat } = this.jwtService.decodeToken(
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

    await this.sessionsRepository.createSession(newSession);

    return tokenPair;
  }

  async logout(dto: RefreshTokensAndLogoutDto): Promise<void> {
    const targetSession =
      await this.sessionsRepository.findByDeviceIdAndIssuedAt(
        dto.issuedAt,
        dto.deviceId
      );

    if (!targetSession) {
      throw new ErrorWithStatusCode(
        APP_CONFIG.ERROR_MESSAGES.SESSION_NOT_FOUND,
        HttpStatuses.Unauthorized
      );
    }

    if (targetSession.iat !== dto.issuedAt) {
      throw new ErrorWithStatusCode(
        APP_CONFIG.ERROR_MESSAGES.REFRESH_TOKEN_IS_NOT_VALID,
        HttpStatuses.Unauthorized
      );
    }

    await this.sessionsRepository.deleteSession(dto.userId, dto.deviceId);
  }

  async refreshTokens(dto: RefreshTokensAndLogoutDto): Promise<TokenPairType> {
    const session = await this.sessionsRepository.findByDeviceIdAndIssuedAt(
      dto.issuedAt,
      dto.deviceId
    );

    if (!session) {
      throw new ErrorWithStatusCode(
        APP_CONFIG.ERROR_MESSAGES.SESSION_NOT_FOUND,
        HttpStatuses.Unauthorized
      );
    }

    const tokenPair = this.jwtService.createJwtPair(dto.userId, dto.deviceId);

    const { exp, iat } = this.jwtService.decodeToken(
      tokenPair.refreshToken
    ) as JwtPayloadRefresh;

    await this.sessionsRepository.updateSessionIatAndExp(
      dto.userId,
      dto.deviceId,
      iat as number,
      exp as number
    );

    return tokenPair;
  }

  async registerUser(dto: UserInputModel) {
    const createdId = await this.usersService.createNewUser(dto, false);
    const targetUser = await this.usersService.getUserById(createdId);

    this.emailManager
      .sendEmailForRegistration(
        targetUser.accountData.email,
        targetUser.emailConfirmation.confirmationCode
      )
      .catch((e) => {
        console.log("registration", e);
      });
  }

  async recoverPassword(email: string) {
    const user = await this.usersRepository.findUserByEmail(email);

    if (!user) return;

    this.emailManager
      .sendEmailForPasswordRecovery(email, user.passwordRecovery.recoveryCode)
      .catch((e) => {
        console.log("password recovery", e);
      });
  }

  async confirmPasswordRecovery(newPassword: string, recoveryCode: string) {
    const user = await this.usersRepository.findUserByRecoveryCode(
      recoveryCode
    );

    if (!user) {
      throw new ErrorWithStatusCode(
        APP_CONFIG.ERROR_MESSAGES.RECOVERY_CODE_IS_INCORRECT,
        HttpStatuses.BadRequest,
        createErrorsObject(
          APP_CONFIG.ERROR_FIELDS.RECOVERY_CODE,
          APP_CONFIG.ERROR_MESSAGES.RECOVERY_CODE_IS_INCORRECT
        )
      );
    }

    const passHash = await this.bcryptService.createHash(newPassword);

    user.confirmPasswordRecovery(passHash);

    await this.usersRepository.save(user);
  }

  async confirmRegistration(confirmationCode: string): Promise<void> {
    const user = await this.usersRepository.getUserByConfirmationCode(
      confirmationCode
    );

    if (!user) {
      throw new ErrorWithStatusCode(
        APP_CONFIG.ERROR_MESSAGES.USER_NOT_FOUND,
        HttpStatuses.BadRequest,
        createErrorsObject(
          APP_CONFIG.ERROR_FIELDS.CONFIRMATION_CODE,
          APP_CONFIG.ERROR_MESSAGES.CONFIRMATION_CODE_INCORRECT
        )
      );
    }

    user.confirmRegistration();

    await this.usersRepository.save(user);
  }

  async resendConfirmationCode(email: string) {
    const user = await this.usersRepository.getUserByLoginOrEmail(email);

    if (!user) {
      throw new ErrorWithStatusCode(
        APP_CONFIG.ERROR_MESSAGES.USER_NOT_FOUND,
        HttpStatuses.BadRequest,
        createErrorsObject(
          APP_CONFIG.ERROR_FIELDS.EMAIL,
          APP_CONFIG.ERROR_MESSAGES.USER_NOT_FOUND
        )
      );
    }

    user.updateConfirmationCode();

    await this.usersRepository.save(user);

    const updatedUser = await this.usersRepository.getUserByLoginOrEmail(email);

    this.emailManager
      .sendEmailForRegistration(
        email,
        updatedUser!.emailConfirmation.confirmationCode
      )
      .catch((e) => console.log(e));
  }

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

    const verifiedUser = this.jwtService.verifyAccessToken(accessToken);

    if (!verifiedUser) {
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
  }
}
