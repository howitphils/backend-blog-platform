import { ObjectId } from "mongodb";
import { UserDbType, UserInputModel } from "../types/users-types";
import { usersRepository } from "../db/mongodb/repositories/users-repository/users-db-repository";

export const usersService = {
  // Создание нового юзера
  async createNewUser(user: UserInputModel): Promise<ObjectId> {
    const newUser: UserDbType = {
      email: user.email,
      login: user.login,
      // passHash,
      createdAt: new Date().toISOString(),
    };
    return usersRepository.createNewPost(newUser);
  },

  // Удаление поста
  async deleteUser(id: ObjectId): Promise<boolean> {
    return usersRepository.deleteUser(id);
  },
};
