import { ObjectId, WithId } from "mongodb";
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

  // Получение юзера по логин/мейлу (для логинизации или проверки существования юзера)
  async getUserByLoginOrEmail(
    loginOrEmail: string
  ): Promise<WithId<UserDbType> | null> {
    return usersCollection.findOne({
      $or: [
        { email: { $regex: loginOrEmail, $options: "i" } },
        { login: { $regex: loginOrEmail, $options: "i" } },
      ],
    });
  },

  async getUserByCredentials(
    login: string,
    email: string
  ): Promise<WithId<UserDbType> | null> {
    return usersCollection.findOne({
      $or: [
        { email: { $regex: email, $options: "i" } },
        { login: { $regex: login, $options: "i" } },
      ],
    });
  },
};
