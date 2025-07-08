import mongoose from "mongoose";
import { container } from "../../../../composition-root";
import { UuidService } from "../../../../adapters/uuIdService";
import { DateFnsService } from "../../../../adapters/dateFnsService";

const uuIdService = container.get(UuidService);
const dateFnsService = container.get(DateFnsService);

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
  accountData: {
    login: { type: String, unique: true, required: true },
    email: { type: String, unique: true, required: true },
    passHash: { type: String },
    createdAt: { type: String },
  },
  emailConfirmation: {
    confirmationCode: { type: String },
    expirationDate: { type: Date },
    isConfirmed: { type: Boolean },
  },
  passwordRecovery: {
    recoveryCode: { type: String },
    expirationDate: { type: Date },
  },
});

type UserModel = mongoose.Model<User>;

export type UserDbDocument = mongoose.HydratedDocument<User>;

export const BlogsModel = mongoose.model<User, UserModel>("User", UsersSchema);
