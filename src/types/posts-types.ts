import { ObjectId } from "mongodb";

export type PostInputModel = {
  title: string; // max 30
  shortDescription: string; // max 100
  content: string; // max 1000
  blogId: string; // valid
};

export type PostViewModel = {
  id: string;
  title: string; // max 30
  shortDescription: string; // max 100
  content: string; // max 1000
  blogId: string; // valid
  blogName: string;
  createdAt: string;
};

export type PostDbType = {
  _id?: ObjectId;
  title: string; // max 30
  shortDescription: string; // max 100
  content: string; // max 1000
  blogId: string; // valid
  blogName: string;
  createdAt: string;
};

export type PostsRequestQueryType = {
  sortBy: string;
  sortDirection: string;
  pageNumber: string;
  pageSize: string;
};

export type PostsMapedQueryType = {
  sortBy: string;
  sortDirection: string;
  pageNumber: number;
  pageSize: number;
};
