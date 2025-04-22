import { ObjectId, WithId } from "mongodb";
import { UserDbType, UserInputModel } from "../types/users-types";
import { usersRepository } from "../db/mongodb/repositories/users-repository/users-db-repository";
import { OutputErrorsType } from "../types/output-errors-types";
import { bcryptService } from "../adapters/bcryptService";
import { CustomError } from "../middlewares/error-handler";
import { HttpStatuses } from "../types/http-statuses";

export const usersService = {
  async createNewUser(
    user: UserInputModel
  ): Promise<OutputErrorsType | ObjectId> {
    const { login, email, password } = user;

    const existingUser = await usersRepository.getUserByCredentials(
      login,
      email
    );

    if (existingUser) {
      const field = existingUser.email === email ? "email" : "login";
      return {
        errorsMessages: [
          {
            field: `${field}`,
            message: `User with this ${field} already exists`,
          },
        ],
      };
    }

    const passHash = await bcryptService.createHasn(password);

    const newUser: UserDbType = {
      email: user.email,
      login: user.login,
      passHash,
      createdAt: new Date().toISOString(),
    };

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
