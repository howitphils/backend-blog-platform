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

  // Получение юзера по логин/мейлу (для логинизации или проверки существования юзера)
  async getUserByCredentials(loginOrEmail: string): Promise<UserDbType | null> {
    return usersCollection.findOne({
      $or: [
        { email: { $regex: loginOrEmail, $options: "i" } },
        { login: { $regex: loginOrEmail, $options: "i" } },
      ],
    });
  },
};
