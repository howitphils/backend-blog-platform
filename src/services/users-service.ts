import { ObjectId, WithId } from "mongodb";
import { UserDbType, UserInputModel } from "../types/users-types";
import { usersRepository } from "../db/mongodb/repositories/users-repository/users-db-repository";
import { bcryptService } from "../adapters/bcryptService";
import { ErrorWithStatusCode } from "../middlewares/error-handler";
import { HttpStatuses } from "../types/http-statuses";
import { createErrorsObject } from "../routers/controllers/utils";
import { uuIdService } from "../adapters/uuIdService";
import { dateFnsService } from "../adapters/dateFnsService";

export const usersService = {
  async createNewUser(
    user: UserInputModel,
    isAdmin: boolean
  ): Promise<ObjectId> {
    const { login, email, password } = user;

    const existingUser = await usersRepository.getUserByCredentials(
      login,
      email
    );

    if (existingUser) {
      const field =
        existingUser.accountData.email === email ? "email" : "login";

      throw new ErrorWithStatusCode(
        "User already exists",
        HttpStatuses.BadRequest,
        createErrorsObject(field, `User with this ${field} already exists`)
      );
    }

    const passHash = await bcryptService.createHasn(password);

    const code = uuIdService.createRandomCode();

    const newUser: UserDbType = {
      accountData: {
        email: user.email,
        login: user.login,
        passHash,
        createdAt: new Date().toISOString(),
      },
      emailConfirmation: {
        confirmationCode: code,
        expirationDate: dateFnsService.addToCurrentDate(),
        isConfirmed: isAdmin ? true : false,
      },
      usedTokens: [],
    };

    return usersRepository.createNewUser(newUser);
  },

  async getUserById(id: ObjectId): Promise<WithId<UserDbType>> {
    const user = await usersRepository.getUserById(id);
    if (!user) {
      throw new ErrorWithStatusCode(
        "User does not exist",
        HttpStatuses.NotFound
      );
    }
    return user;
  },

  async deleteUser(id: ObjectId): Promise<boolean> {
    const targetUser = await usersRepository.getUserById(id);

    if (!targetUser) {
      throw new ErrorWithStatusCode(
        "User does not exist",
        HttpStatuses.NotFound
      );
    }

    return usersRepository.deleteUser(id);
  },
};
