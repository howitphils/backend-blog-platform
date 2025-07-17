import mongoose from "mongoose";
import {
  CreatePostDto,
  NewestLikeType,
  PostInputModel,
} from "../../../../types/posts-types";
import { PostMethodsType, PostModelType } from "./post-entity-types";
import { PostLikeDbDocumentType } from "../likes-repository/post-likes/post-like-entity-types";

export class PostEntity {
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
  blogName: string;
  createdAt: string;
  likesCount: number;
  dislikesCount: number;
  newestLikes: PostLikeDbDocumentType[];

  private constructor(
    title: string,
    shortDescription: string,
    content: string,
    blogId: string,
    blogName: string
  ) {
    this.title = title;
    this.shortDescription = shortDescription;
    this.content = content;
    this.blogId = blogId;
    this.blogName = blogName;
    this.createdAt = new Date().toISOString();
    this.likesCount = 0;
    this.dislikesCount = 0;
    this.newestLikes = [];
  }

  static createPost(dto: CreatePostDto) {
    return new PostModel(
      new PostEntity(
        dto.title,
        dto.shortDescription,
        dto.content,
        dto.blogId,
        dto.blogName
      )
    );
  }

  updatePost(dto: PostInputModel): PostEntity {
    this.title = dto.title;
    this.content = dto.content;
    this.shortDescription = dto.shortDescription;

    return this;
  }

  increaseLikesCount() {
    this.likesCount += 1;
  }
  decreaseLikesCount() {
    this.likesCount -= 1;
  }
  increaseDislikesCount() {
    this.dislikesCount += 1;
  }
  decreaseDislikesCount() {
    this.dislikesCount -= 1;
  }

  resetDislikesCount() {
    this.dislikesCount = 0;
  }
  resetLikesCount() {
    this.likesCount = 0;
  }

  updateNewestLikes(newestLikes: PostLikeDbDocumentType[]) {
    this.newestLikes = newestLikes;
  }
}

const NewestLikeSchema = new mongoose.Schema<NewestLikeType>({
  addedAt: {
    type: String,
    required: true,
  },
  login: {
    type: String,
    required: true,
  },
  userId: {
    type: String,
    required: true,
  },
});

const PostSchema = new mongoose.Schema<
  PostEntity,
  PostModelType,
  PostMethodsType
>({
  title: {
    type: String,
    required: true,
    maxlength: 100,
    minlength: 1,
  },
  shortDescription: {
    type: String,
    required: true,
    maxlength: 100,
    minlength: 1,
  },
  content: {
    type: String,
    required: true,
    maxlength: 1000,
    minlength: 1,
  },
  blogId: {
    type: String,
    required: true,
  },
  blogName: {
    type: String,
    required: true,
    maxlength: 50,
    minlength: 1,
  },
  createdAt: {
    type: String,
    required: true,
  },
  dislikesCount: {
    type: Number,
    required: true,
  },
  likesCount: {
    type: Number,
    required: true,
  },
  newestLikes: [NewestLikeSchema],
});

PostSchema.loadClass(PostEntity);

export const PostModel = mongoose.model<PostEntity, PostModelType>(
  "Post",
  PostSchema
);
