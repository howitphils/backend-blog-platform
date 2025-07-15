import mongoose from "mongoose";
import { BlogInputModel } from "../../../../types/blogs-types";

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

  static createNewBlog(dto: BlogInputModel): BlogDbDocument {
    const newBlog = new BlogEntity(dto.name, dto.description, dto.websiteUrl);
    const newDbBlog = new BlogsModel(newBlog);

    return newDbBlog;
  }

  updateBlog(dto: BlogInputModel): BlogEntity {
    this.name = dto.name;
    this.description = dto.description;
    this.websiteUrl = dto.websiteUrl;

    return this;
  }
}

interface BlogMethods {
  updateBlog(dto: BlogInputModel): BlogEntity;
}

interface BlogStatics {
  createNewBlog(dto: BlogInputModel): BlogDbDocument;
}

type BlogsModel = mongoose.Model<BlogEntity, {}, BlogMethods> & BlogStatics;

const BlogsSchema = new mongoose.Schema<BlogEntity, BlogsModel, BlogMethods>({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  websiteUrl: {
    type: String,
    required: true,
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

export type BlogDbDocument = mongoose.HydratedDocument<BlogEntity, BlogMethods>;

// Заменяет собой присвоение значений BlogsSchema.statics и BlogsSchema.methods и берет их автоматически из класса (не нужно описывать методы вручную)
BlogsSchema.loadClass(BlogEntity);

export const BlogsModel = mongoose.model<BlogEntity, BlogsModel>(
  "Blog",
  BlogsSchema
);
