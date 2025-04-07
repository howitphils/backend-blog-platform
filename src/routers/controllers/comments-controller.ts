import { Request, Response } from "express";
import { ObjectId } from "mongodb";
import {
  UserInputModel,
  UsersRequestQueryType,
  UserViewModel,
} from "../../types/users-types";
import { usersQueryRepository } from "../../db/mongodb/repositories/users-repository/users-query-repository";
import { usersService } from "../../services/users-service";
import { mapUsersQueryParams } from "./utils";
import { PaginationType } from "../../types/blogs-types";

export const commentsController = {
  async getCommentById(req: Request<{ id: ObjectId }>, res: Response) {
    const targetComment = await 
  },
  async updateComment(req: Request<{ id: ObjectId }>, res: Response) {},
  async deleteComment(req: Request<{ id: ObjectId }>, res: Response) {},
};
