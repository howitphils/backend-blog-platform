import { ObjectId } from "mongodb";
import { usersCollection } from "../../mongodb";
import { UserDbType } from "../../../../types/users-types";

export const usersRepository = {
  // Создание нового юзера
  async createNewUser(user: UserDbType): Promise<ObjectId> {
    const createResult = await usersCollection.insertOne(user);
    return createResult.insertedId;
  },

  // Удаление юзера
  async deleteUser(_id: ObjectId): Promise<boolean> {
    const deleteResult = await usersCollection.deleteOne({ _id });
    return deleteResult.deletedCount === 1;
  },

  async getUserByCredentials(credentials: {
    loginOrEmail: string;
    passHash: string;
  }) {
    const { loginOrEmail, passHash } = credentials;
    return usersCollection.findOne({
      $and: [
        { $or: [{ email: loginOrEmail }, { login: loginOrEmail }] },
        { passHash },
      ],
    });
  },
};
