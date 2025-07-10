import { UserDbDocument, UserModel } from "./user-entitty";

export class UsersRepository {
  async save(user: UserDbDocument): Promise<string> {
    const result = await user.save();
    return result.id;
  }

  async getUserById(id: string): Promise<UserDbDocument | null> {
    return UserModel.findById(id);
  }

  // Получение юзера по логин/мейлу (для логинизации)
  async getUserByLoginOrEmail(
    loginOrEmail: string
  ): Promise<UserDbDocument | null> {
    const user = await UserModel.findOne({
      $or: [
        { "accountData.email": { $regex: loginOrEmail, $options: "i" } },
        { "accountData.login": { $regex: loginOrEmail, $options: "i" } },
      ],
    });
    return user;
  }

  // Отдельный метод для проверки на существование пользователя с таким email/login
  async getUserByCredentials(
    login: string,
    email: string
  ): Promise<UserDbDocument | null> {
    return UserModel.findOne({
      $or: [
        { "accountData.email": { $regex: email, $options: "i" } },
        { "accountData.login": { $regex: login, $options: "i" } },
      ],
    });
  }

  async getUserByConfirmationCode(
    confirmationCode: string
  ): Promise<UserDbDocument | null> {
    return UserModel.findOne({
      "emailConfirmation.confirmationCode": confirmationCode,
    });
  }

  // async updateIsConfirmedStatus(id: string, newStatus: boolean) {
  //   const updateResult = await UserModel.updateOne(
  //     { id },
  //     { $set: { "emailConfirmation.isConfirmed": newStatus } }
  //   );

  //   return updateResult.matchedCount === 1;
  // }

  async updateConfirmationCodeAndExpirationDate(
    id: string,
    newCode: string,
    newDate: Date
  ) {
    const updateResult = await UserModel.updateOne(
      { id },
      {
        $set: {
          "emailConfirmation.confirmationCode": newCode,
          "emailConfirmation.expirationDate": newDate,
        },
      }
    );

    return updateResult.matchedCount === 1;
  }

  async findUserByRecoveryCode(code: string): Promise<UserDbDocument | null> {
    return UserModel.findOne({ "passwordRecovery.recoveryCode": code });
  }

  async findUserByEmail(email: string): Promise<UserDbDocument | null> {
    return UserModel.findOne({ "accountData.email": email });
  }

  // async updatePasswordHash(userId: string, hash: string): Promise<boolean> {
  //   const result = await UserModel.updateOne(
  //     { _id: userId },
  //     { $set: { "accountData.passHash": hash } }
  //   );

  //   return result.matchedCount === 1;
  // }
}
