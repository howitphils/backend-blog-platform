import { randomUUID } from "crypto";
import { add } from "date-fns";
import mongoose from "mongoose";
import {
  UserDbDocumentType,
  UserMethodsType,
  UserModelType,
} from "./user-entity-types";
import { CreateUserDtoType } from "../../../../types/users-types";

export class UserEntity {
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
    isAdmin: boolean
  ) {
    this.accountData = {
      email,
      login,
      passHash,
      createdAt: new Date().toISOString(),
    };
    this.emailConfirmation = {
      confirmationCode: randomUUID(),
      expirationDate: add(new Date(), {
        days: 2,
      }),
      isConfirmed: isAdmin,
    };
    this.passwordRecovery = {
      recoveryCode: randomUUID(),
      expirationDate: add(new Date(), {
        days: 2,
      }),
    };
  }

  static createNewUser(dto: CreateUserDtoType): UserDbDocumentType {
    return new UserModel(
      new UserEntity(dto.email, dto.login, dto.passHash, dto.isAdmin)
    );
  }
}

const UserSchema = new mongoose.Schema<
  UserEntity,
  UserModelType,
  UserMethodsType
>({
  accountData: {
    login: {
      type: String,
      unique: true,
      required: true,
      minlength: 3,
      maxlength: 50,
    },
    email: {
      type: String,
      unique: true,
      required: true,
      minlength: 3,
      maxlength: 100,
    },
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

UserSchema.loadClass(UserEntity);

export const UserModel = mongoose.model<UserEntity, UserModelType>(
  "User",
  UserSchema
);
