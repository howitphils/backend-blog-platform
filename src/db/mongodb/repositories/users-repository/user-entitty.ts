import mongoose from "mongoose";

export class User {
  accountData: {
    login: string;
    email: string;
    passHash: string;
    createdAt: string;
  };
  emailConfirmation: {
    confirmationCode: string;
    expirationDate: Date;
    isConfirmed: boolean;
  };
  passwordRecovery: {
    recoveryCode: string;
    expirationDate: Date;
  };

  constructor(
    email: string,
    login: string,
    passHash: string,
    isAdmin?: boolean
  ) {
    this.accountData = {
      email,
      login,
      passHash,
      createdAt: new Date().toISOString(),
    };
    this.emailConfirmation = {
      confirmationCode: uuIdService.createRandomCode(),
      expirationDate: dateFnsService.addToCurrentDate(),
      isConfirmed: isAdmin ? true : false,
    };
    this.passwordRecovery = {
      recoveryCode: uuIdService.createRandomCode(),
      expirationDate: dateFnsService.addToCurrentDate(),
    };
  }
}

const UsersSchema = new mongoose.Schema<User>({
  accountData,
  emailConfirmation,
  passwordRecovery,
});

type UserModel = mongoose.Model<User>;

export type UserDbDocument = mongoose.HydratedDocument<User>;

export const BlogsModel = mongoose.model<User, UserModel>("Blog", UsersSchema);
