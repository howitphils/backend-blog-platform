import mongoose from "mongoose";

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

const BlogsSchema = new mongoose.Schema<Blog>({
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

type BlogModel = mongoose.Model<Blog>;

export type BlogDbDocument = mongoose.HydratedDocument<Blog>;

export const BlogsModel = mongoose.model<Blog, BlogModel>("Blog", BlogsSchema);
