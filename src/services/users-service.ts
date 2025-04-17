import { ObjectId, WithId } from "mongodb";
import { UserDbType, UserInputModel } from "../types/users-types";
import { usersRepository } from "../db/mongodb/repositories/users-repository/users-db-repository";
import { LoginInputModel } from "../types/login-types";
import { OutputErrorsType } from "../types/output-errors-types";
import { bcryptService } from "../application/bcryptService";

export const usersService = {
  // Создание нового юзера
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

  // Проверка на существование юзера
  async validateUser(
    credentials: LoginInputModel
  ): Promise<WithId<UserDbType> | null> {
    const { loginOrEmail, password } = credentials;

    const targetUser = await usersRepository.getUserByLoginOrEmail(
      loginOrEmail
    );

    if (!targetUser) return null;

    const isCorrect = await bcryptService.compareHash(
      password,
      targetUser.passHash
    );

    return isCorrect ? targetUser : null;
  },

  async getUserById(id: ObjectId): Promise<WithId<UserDbType> | null> {
    return usersRepository.getUserById(id);
  },

  async deleteUser(id: ObjectId): Promise<boolean> {
    return usersRepository.deleteUser(id);
  },
};
