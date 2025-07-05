import mongoose from "mongoose";
import { BlogDbType } from "../../../../types/blogs-types";

const blogsSchema = new mongoose.Schema<BlogDbType>({
  name: { type: String, required: true },
  description: { type: String },
  websiteUrl: { type: String },
  createdAt: { type: String },
  isMembership: { type: Boolean },
});

export const BlogsModel = mongoose.model("Blog", blogsSchema);
