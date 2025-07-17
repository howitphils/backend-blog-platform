import mongoose from "mongoose";
import { BlogInputModel } from "../../../../types/blogs-types";
import { BlogEntity } from "./blog-entity";

export type BlogMethodsType = {
  updateBlog(dto: BlogInputModel): BlogEntity;
};

export type BlogStaticsType = {
  createNewBlog(dto: BlogInputModel): BlogDbDocumentType;
};

export type BlogDbDocumentType = mongoose.HydratedDocument<
  BlogEntity,
  BlogMethodsType
>;

export type BlogModelType = mongoose.Model<BlogEntity, {}, BlogMethodsType> &
  BlogStaticsType;
