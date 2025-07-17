import mongoose from "mongoose";
import { UserEntity } from "./user-entitty";
import { UserInputModel } from "../../../../types/users-types";

export type UserMethodsType = {};

export type UserStaticsType = {
  createNewUser(dto: UserInputModel): UserDbDocumentType;
};

export type UserDbDocumentType = mongoose.HydratedDocument<
  UserEntity,
  UserMethodsType
>;

export type UserModelType = mongoose.Model<UserEntity, {}, UserMethodsType> &
  UserStaticsType;
