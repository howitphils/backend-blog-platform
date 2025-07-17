import { randomUUID } from "crypto";
import { add } from "date-fns";
import mongoose from "mongoose";
import {
  UserDbDocumentType,
  UserMethodsType,
  UserModelType,
} from "./user-entity-types";
import { CreateUserDtoType } from "../../../../types/users-types";
import { ErrorWithStatusCode } from "../../../../middlewares/error-handler";
import { HttpStatuses } from "../../../../types/http-statuses";
import { APP_CONFIG } from "../../../../settings";
import { createErrorsObject } from "../../../../routers/controllers/utils";
import { dateFnsService } from "../../../../adapters/dateFnsService";
import { uuidService } from "../../../../adapters/uuIdService";

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

  private constructor(
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
      confirmationCode: uuidService.createRandomCode(),
      expirationDate: dateFnsService.addToCurrentDate(),
      isConfirmed: isAdmin,
    };
    this.passwordRecovery = {
      recoveryCode: uuidService.createRandomCode(),
      expirationDate: dateFnsService.addToCurrentDate(),
    };
  }

  static createNewUser(dto: CreateUserDtoType): UserDbDocumentType {
    return new UserModel(
      new UserEntity(dto.email, dto.login, dto.passHash, dto.isAdmin)
    );
  }

  confirmPasswordRecovery(newPasswordHash: string): void {
    if (this.passwordRecovery.expirationDate < new Date()) {
      throw new ErrorWithStatusCode(
        APP_CONFIG.ERROR_MESSAGES.RECOVERY_CODE_IS_EXPIRED,
        HttpStatuses.BadRequest
      );
    }

    this.accountData.passHash = newPasswordHash;

    this.passwordRecovery.recoveryCode = randomUUID();
    this.passwordRecovery.expirationDate = add(new Date(), {
      months: 1,
      days: 2,
    });
  }

  confirmRegistration(): void {
    if (this.emailConfirmation.expirationDate < new Date()) {
      throw new ErrorWithStatusCode(
        APP_CONFIG.ERROR_MESSAGES.CONFIRMATION_CODE_EXPIRED,
        HttpStatuses.BadRequest,
        createErrorsObject(
          APP_CONFIG.ERROR_FIELDS.CONFIRMATION_CODE,
          APP_CONFIG.ERROR_MESSAGES.CONFIRMATION_CODE_EXPIRED
        )
      );
    }

    if (this.emailConfirmation.isConfirmed) {
      throw new ErrorWithStatusCode(
        APP_CONFIG.ERROR_MESSAGES.EMAIL_ALREADY_CONFIRMED,
        HttpStatuses.BadRequest,
        createErrorsObject(
          APP_CONFIG.ERROR_FIELDS.CONFIRMATION_CODE,
          APP_CONFIG.ERROR_MESSAGES.EMAIL_ALREADY_CONFIRMED
        )
      );
    }

    this.emailConfirmation.isConfirmed = true;
  }

  updateEmailConfirmationCode() {
    if (this.emailConfirmation.isConfirmed) {
      throw new ErrorWithStatusCode(
        APP_CONFIG.ERROR_MESSAGES.EMAIL_ALREADY_CONFIRMED,
        HttpStatuses.BadRequest,
        createErrorsObject(
          APP_CONFIG.ERROR_FIELDS.EMAIL,
          APP_CONFIG.ERROR_MESSAGES.EMAIL_ALREADY_CONFIRMED
        )
      );
    }

    this.emailConfirmation.confirmationCode = uuidService.createRandomCode();
    this.emailConfirmation.expirationDate = dateFnsService.addToCurrentDate();
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
