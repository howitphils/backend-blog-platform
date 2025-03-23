import { ObjectId } from "mongodb";
import { hash } from "bcryptjs";
import { UserDbType, UserInputModel } from "../types/users-types";
import { usersRepository } from "../db/mongodb/repositories/users-repository/users-db-repository";
import { LoginInputModel } from "../types/login-types";

export const usersService = {
  // Создание нового юзера
  async createNewUser(user: UserInputModel): Promise<ObjectId> {
    // Добавить проверку на уникальность

    const passHash = await this.generateHash(user.password);

    const newUser: UserDbType = {
      email: user.email,
      login: user.login,
      passHash,
      createdAt: new Date().toISOString(),
    };
    return usersRepository.createNewUser(newUser);
  },

  async checkUser(credentials: LoginInputModel): Promise<boolean> {
    const { loginOrEmail, password } = credentials;

    const passHash = await this.generateHash(password);

    const targetUser = await usersRepository.getUserByCredentials({
      loginOrEmail,
      passHash,
    });
    return !!targetUser;
  },

  // Удаление юзера
  async deleteUser(id: ObjectId): Promise<boolean> {
    return usersRepository.deleteUser(id);
  },

  async generateHash(password: string): Promise<string> {
    return hash(password, 8);
  },
};
