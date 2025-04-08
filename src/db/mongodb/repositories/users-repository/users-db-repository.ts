import { ObjectId, WithId } from "mongodb";
import { UserDbType } from "../../../../types/users-types";
import { usersCollection } from "../../mongodb";
// import { db } from "../../mongo";
// import { SETTINGS } from "../../../../settings";

// const usersCollection = db.getCollections(SETTINGS.DB_NAME).usersCollection;

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

  // Отдельный метод для проверки на существование пользователя с таким email/login
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

  async getUserById(_id: ObjectId): Promise<WithId<UserDbType> | null> {
    return usersCollection.findOne({ _id });
  },
};
