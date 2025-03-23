import { ObjectId } from "mongodb";

export type UserInputModel = {
  login: string;
  email: string;
  password: string;
};

export type UserViewModel = {
  id: string;
  login: string;
  email: string;
  createdAt: string;
};

export type UserDbType = {
  _id?: ObjectId;
  login: string;
  email: string;
  createdAt: string;
};

export type UsersRequestQueryType = {
  searchLoginTerm: string;
  searchEmailTerm: string;
  sortBy: string;
  sortDirection: string;
  pageNumber: string;
  pageSize: string;
};

export type UsersMapedQueryType = {
  searchLoginTerm: string | null;
  searchEmailTerm: string | null;
  sortBy: string | "createdAt";
  sortDirection: "asc" | "desc";
  pageNumber: number;
  pageSize: number;
};
