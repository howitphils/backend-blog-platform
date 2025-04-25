import { ObjectId, WithId } from "mongodb";
import { UserDbType, UserInputModel } from "../types/users-types";
import { usersRepository } from "../db/mongodb/repositories/users-repository/users-db-repository";
import { bcryptService } from "../adapters/bcryptService";
import {
  CustomError,
  CustomErrorWithObject,
} from "../middlewares/error-handler";
import { HttpStatuses } from "../types/http-statuses";
import { v4 } from "uuid";
import { add } from "date-fns";

export const usersService = {
  async createNewUser(user: UserInputModel): Promise<ObjectId> {
    const { login, email, password } = user;

    const existingUser = await usersRepository.getUserByCredentials(
      login,
      email
    );

    if (existingUser) {
      const field =
        existingUser.accountData.email === email ? "email" : "login";

      throw new CustomErrorWithObject(
        "User already exists",
        HttpStatuses.BadRequest,
        {
          errorsMessages: [
            {
              field: `${field}`,
              message: `User with this ${field} already exists`,
            },
          ],
        }
      );
    }

    const passHash = await bcryptService.createHasn(password);

    const newUser: UserDbType = {
      accountData: {
        email: user.email,
        login: user.login,
        passHash,
        createdAt: new Date().toISOString(),
      },
      emailConfirmation: {
        confirmationCode: v4(),
        expirationDate: add(new Date(), {
          hours: 2,
          minutes: 22,
        }),
        isConfirmed: false,
      },
    };

    console.log(newUser.emailConfirmation.confirmationCode);

    return usersRepository.createNewUser(newUser);
  },

  async getUserById(id: ObjectId): Promise<WithId<UserDbType>> {
    const user = await usersRepository.getUserById(id);
    if (!user) {
      throw new CustomError("User does not exist", HttpStatuses.NotFound);
    }
    return user;
  },

  async deleteUser(id: ObjectId): Promise<boolean> {
    const targetUser = await usersRepository.getUserById(id);

    if (!targetUser) {
      throw new CustomError("User does not exist", HttpStatuses.NotFound);
    }

    return usersRepository.deleteUser(id);
  },
};
