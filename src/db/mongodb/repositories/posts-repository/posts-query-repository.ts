import { ObjectId } from "mongodb";
import {
  PostDbType,
  PostsMapedQueryType,
  PostViewModel,
} from "../../../../types/posts-types";
import { postsCollection } from "../../mongodb";
import { PaginationType } from "../../../../types/blogs-types";

export const postsQueryRepository = {
  async getAllPosts(filters: PostsMapedQueryType): Promise<PaginationType> {
    const { pageNumber, pageSize, sortBy, sortDirection } = filters;

    const posts = await postsCollection
      .find({})
      .sort({ [sortBy]: sortDirection === "desc" ? -1 : 1 })
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize)
      .toArray();

    const totalCount = await postsCollection.countDocuments();

    return {
      page: pageNumber,
      pagesCount: Math.ceil(totalCount / pageSize),
      pageSize: pageSize,
      totalCount,
      items: posts.map(this.mapFromDbToViewModel),
    };
  },

  async getPostById(_id: ObjectId): Promise<PostDbType | null> {
    const post = await postsCollection.findOne({ _id });
    if (post) {
      return this.mapFromDbToViewModel(post);
    }
    return null;
  },

  mapFromDbToViewModel(obj: PostDbType): PostViewModel {
    const { _id, ...rest } = obj;
    return { ...rest, id: _id!.toString() };
  },
};
