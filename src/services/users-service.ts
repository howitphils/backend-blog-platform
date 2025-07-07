import { ObjectId, WithId } from "mongodb";
import { UserDbType, UserInputModel } from "../types/users-types";
import { ErrorWithStatusCode } from "../middlewares/error-handler";
import { HttpStatuses } from "../types/http-statuses";
import { createErrorsObject } from "../routers/controllers/utils";
import { APP_CONFIG } from "../settings";
import { UsersRepository } from "../db/mongodb/repositories/users-repository/users-db-repository";
import { BcryptService } from "../adapters/bcryptService";
import { inject, injectable } from "inversify";
import { DateFnsService } from "../adapters/dateFnsService";
import { UuidService } from "../adapters/uuIdService";

@injectable()
export class UsersService {
  constructor(
    @inject(UsersRepository)
    private usersRepository: UsersRepository,

    @inject(BcryptService)
    private bcryptService: BcryptService,

    @inject(DateFnsService)
    private dateFnsService: DateFnsService,

    @inject(UuidService)
    private uuIdService: UuidService
  ) {}

  async createNewUser(
    user: UserInputModel,
    isAdmin: boolean
  ): Promise<ObjectId> {
    const { login, email, password } = user;

    const existingUser = await this.usersRepository.getUserByCredentials(
      login,
      email
    );

    if (existingUser) {
      const field =
        existingUser.accountData.email === email ? "email" : "login";

      throw new ErrorWithStatusCode(
        APP_CONFIG.ERROR_MESSAGES.USER_ALREADY_EXISTS,
        HttpStatuses.BadRequest,
        createErrorsObject(field, `User with this ${field} already exists`)
      );
    }

    const passHash = await this.bcryptService.createHasn(password);

    const confirmationCode = this.uuIdService.createRandomCode();
    const recoveryCode = this.uuIdService.createRandomCode();

    // const newUser: User = new User(email, login, passHash, isAdmin);

    const newUser: UserDbType = {
      accountData: {
        email: user.email,
        login: user.login,
        passHash,
        createdAt: new Date().toISOString(),
      },
      emailConfirmation: {
        confirmationCode,
        expirationDate: this.dateFnsService.addToCurrentDate(),
        isConfirmed: isAdmin ? true : false,
      },
      passwordRecovery: {
        recoveryCode,
        expirationDate: this.dateFnsService.addToCurrentDate(),
      },
    };

    return this.usersRepository.createNewUser(newUser);
  }

  async getUserById(id: ObjectId): Promise<WithId<UserDbType>> {
    const user = await this.usersRepository.getUserById(id);
    if (!user) {
      throw new ErrorWithStatusCode(
        APP_CONFIG.ERROR_MESSAGES.USER_NOT_FOUND,
        HttpStatuses.NotFound
      );
    }
    return user;
  }

  async deleteUser(id: string): Promise<boolean> {
    const targetUser = await this.usersRepository.getUserById(id);

    if (!targetUser) {
      throw new ErrorWithStatusCode(
        APP_CONFIG.ERROR_MESSAGES.USER_NOT_FOUND,
        HttpStatuses.NotFound
      );
    }

    return this.usersRepository.deleteUser(id);
  }
}
