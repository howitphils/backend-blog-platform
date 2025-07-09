import mongoose from "mongoose";
import { UuidService } from "../../../../adapters/uuIdService";
import { DateFnsService } from "../../../../adapters/dateFnsService";

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
    uuIdService: UuidService,
    dateFnsService: DateFnsService,
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
  accountData: {
    login: { type: String, unique: true, required: true },
    email: { type: String, unique: true, required: true },
    passHash: { type: String, required: true },
    createdAt: { type: String, required: true },
  },
  emailConfirmation: {
    confirmationCode: { type: String, required: true },
    expirationDate: { type: Date, required: true },
    isConfirmed: { type: Boolean, required: true },
  },
  passwordRecovery: {
    recoveryCode: { type: String, required: true },
    expirationDate: { type: Date, required: true },
  },
});

type UserModel = mongoose.Model<User>;

export type UserDbDocument = mongoose.HydratedDocument<User>;

export const UserModel = mongoose.model<User, UserModel>("User", UsersSchema);
