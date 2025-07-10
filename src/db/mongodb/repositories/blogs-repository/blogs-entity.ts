import mongoose from "mongoose";
import { BlogDbType } from "../../../../types/blogs-types";

export class Blog {
  name: string;
  description: string;
  websiteUrl: string;
  createdAt: string;
  isMembership: boolean;

  constructor(name: string, description: string, websiteUrl: string) {
    this.name = name;
    this.description = description;
    this.websiteUrl = websiteUrl;
    this.createdAt = new Date().toISOString();
    this.isMembership = false;
  }
}

const BlogsSchema = new mongoose.Schema<BlogDbType>({
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

type BlogModel = mongoose.Model<BlogDbType>;

export type BlogDbDocument = mongoose.HydratedDocument<BlogDbType>;

export const BlogsModel = mongoose.model<BlogDbType, BlogModel>(
  "Blog",
  BlogsSchema
);
