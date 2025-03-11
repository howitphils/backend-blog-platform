import { BlogDbType, BlogViewModel } from "../../types/blogs-types";
import { PostDbType, PostViewModel } from "../../types/posts-types";

export const mapFromDbToViewModel = (
  obj: BlogDbType | PostDbType
): BlogViewModel | PostViewModel => {
  const { _id, ...rest } = obj;
  return { ...rest, id: _id!.toString() };
};
