import { Request, Response } from "express";
import { LoginInputModel } from "../../types/login-types";
import { usersService } from "../../services/users-service";
import { jwtService } from "../../application/jwtService";

export const authController = {
  async checkUser(req: Request<{}, {}, LoginInputModel>, res: Response) {
    const checkResult = await usersService.checkUser(req.body);
    if (!checkResult) {
      res.sendStatus(401);
      return;
    }

    const token = jwtService.createJwt();

    res.sendStatus(204);
  },
};
