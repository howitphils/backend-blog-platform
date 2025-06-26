import { ObjectId, WithId } from "mongodb";
import { UserDbType } from "../../../../types/users-types";
import { usersCollection } from "../../mongodb";

export class UsersRepository {
  // Создание нового юзера
  async createNewUser(user: UserDbType): Promise<ObjectId> {
    const createResult = await usersCollection.insertOne(user);
    return createResult.insertedId;
  }

  // Удаление юзера
  async deleteUser(_id: ObjectId): Promise<boolean> {
    const deleteResult = await usersCollection.deleteOne({ _id });
    return deleteResult.deletedCount === 1;
  }

  // Получение юзера по логин/мейлу (для логинизации)
  async getUserByLoginOrEmail(
    loginOrEmail: string
  ): Promise<WithId<UserDbType> | null> {
    return usersCollection.findOne({
      $or: [
        { "accountData.email": { $regex: loginOrEmail, $options: "i" } },
        { "accountData.login": { $regex: loginOrEmail, $options: "i" } },
      ],
    });
  }

  // Отдельный метод для проверки на существование пользователя с таким email/login
  async getUserByCredentials(
    login: string,
    email: string
  ): Promise<WithId<UserDbType> | null> {
    return usersCollection.findOne({
      $or: [
        { "accountData.email": { $regex: email, $options: "i" } },
        { "accountData.login": { $regex: login, $options: "i" } },
      ],
    });
  }

  async getUserByConfirmationCode(
    confirmationCode: string
  ): Promise<WithId<UserDbType> | null> {
    return usersCollection.findOne({
      "emailConfirmation.confirmationCode": confirmationCode,
    });
  }

  async updateIsConfirmedStatus(_id: ObjectId, newStatus: boolean) {
    const updateResult = await usersCollection.updateOne(
      { _id },
      { $set: { "emailConfirmation.isConfirmed": newStatus } }
    );

    return updateResult.matchedCount === 1;
  }

  async updateConfirmationCodeAndExpirationDate(
    _id: ObjectId,
    newCode: string,
    newDate: Date
  ) {
    const updateResult = await usersCollection.updateOne(
      { _id },
      {
        $set: {
          "emailConfirmation.confirmationCode": newCode,
          "emailConfirmation.expirationDate": newDate,
        },
      }
    );

    return updateResult.matchedCount === 1;
  }

  async getUserById(_id: ObjectId): Promise<WithId<UserDbType> | null> {
    return usersCollection.findOne({ _id });
  }

  async findUserByRefreshToken(
    token: string
  ): Promise<WithId<UserDbType> | null> {
    return usersCollection.findOne({ usedTokens: { $in: [token] } });
  }

  async findUserByRecoveryCode(
    code: string
  ): Promise<WithId<UserDbType> | null> {
    return usersCollection.findOne({ "passwordRecovery.recoveryCode": code });
  }

  async findUserByEmail(email: string): Promise<WithId<UserDbType> | null> {
    return usersCollection.findOne({ "accountData.email": email });
  }

  async updatePasswordHash(userId: ObjectId, hash: string): Promise<boolean> {
    const result = await usersCollection.updateOne(
      { _id: userId },
      { $set: { "accountData.passHash": hash } }
    );

    return result.matchedCount === 1;
  }
}
