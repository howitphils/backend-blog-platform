import { Request, Response } from "express";
import { LoginInputModel } from "../../types/login-types";
import { usersService } from "../../services/users-service";

export const authController = {
  async checkUser(req: Request<{}, {}, LoginInputModel>, res: Response) {
    const isExisting = await usersService.checkUser(req.body);
    if (!isExisting) {
      res.status(401);
      return;
    }
    res.sendStatus(204);
  },
};
