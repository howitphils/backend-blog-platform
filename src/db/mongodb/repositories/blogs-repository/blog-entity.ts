import mongoose from "mongoose";
import { BlogInputModel } from "../../../../types/blogs-types";
import {
  BlogDbDocumentType,
  BlogMethodsType,
  BlogModelType,
} from "./blog-entity-type";

export class BlogEntity {
  name: string;
  description: string;
  websiteUrl: string;
  createdAt: string;
  isMembership: boolean;

  private constructor(name: string, description: string, websiteUrl: string) {
    this.name = name;
    this.description = description;
    this.websiteUrl = websiteUrl;
    this.createdAt = new Date().toISOString();
    this.isMembership = false;
  }

  static createNewBlog(dto: BlogInputModel): BlogDbDocumentType {
    return new BlogModel(
      new BlogEntity(dto.name, dto.description, dto.websiteUrl)
    );
  }

  updateBlog(dto: BlogInputModel): BlogEntity {
    this.name = dto.name;
    this.description = dto.description;
    this.websiteUrl = dto.websiteUrl;

    return this;
  }
}

const BlogSchema = new mongoose.Schema<
  BlogEntity,
  BlogModelType,
  BlogMethodsType
>({
  name: {
    type: String,
    required: true,
    maxlength: 50,
    minlength: 1,
  },
  description: {
    type: String,
    required: true,
    maxlength: 500,
    minlength: 1,
  },
  websiteUrl: {
    type: String,
    required: true,
    maxlength: 100,
    minlength: 1,
  },
  createdAt: {
    type: String,
    required: true,
  },
  isMembership: {
    type: Boolean,
    default: false,
  },
});

// Заменяет собой присвоение значений BlogsSchema.statics и BlogsSchema.methods и берет их автоматически из класса (не нужно описывать сами методы вручную)
BlogSchema.loadClass(BlogEntity);

export const BlogModel = mongoose.model<BlogEntity, BlogModelType>(
  "Blog",
  BlogSchema
);
