import mongoose from "mongoose";
import { BlogDbType, BlogInputModel } from "../../../../types/blogs-types";

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

  updateBlog(dto: BlogInputModel): BlogDbType {
    this.name = dto.name;
    this.description = dto.description;
    this.websiteUrl = dto.websiteUrl;

    return this;
  }
}

interface BlogMethods {
  updateBlog(dto: BlogInputModel): BlogDbType;
}

interface BlogStatics {
  createNewBlog(dto: BlogInputModel): BlogDbDocument;
}

type BlogsModel = mongoose.Model<BlogDbType, {}, BlogMethods> & BlogStatics;

const BlogsSchema = new mongoose.Schema<BlogDbType, BlogsModel, BlogMethods>({
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

export type BlogDbDocument = mongoose.HydratedDocument<BlogDbType, BlogMethods>;

BlogsSchema.loadClass(BlogEntity);

export const BlogsModel = mongoose.model<BlogDbType, BlogsModel>(
  "Blog",
  BlogsSchema
);
