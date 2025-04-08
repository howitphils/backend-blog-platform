import { Request, Response } from "express";
import { LoginInputModel } from "../../types/login-types";
import { usersService } from "../../services/users-service";
import { jwtService } from "../../application/jwtService";
import { RequestWithBody } from "../../types/requests-types";
import { usersQueryRepository } from "../../db/mongodb/repositories/users-repository/users-query-repository";
import { ObjectId } from "mongodb";
import { meModel } from "../../types/users-types";

export const authController = {
  async checkUser(req: RequestWithBody<LoginInputModel>, res: Response) {
    const { loginOrEmail, password } = req.body;

    const user = await usersService.checkUser({
      loginOrEmail,
      password,
    });

    if (!user) {
      res.sendStatus(401);
      return;
    }

    const token = jwtService.createJwt(user._id);

    res.status(200).json({ accessToken: token });
  },

  async getMyInfo(req: Request, res: Response) {
    const userId = req.user?.id;
    if (!userId) {
      res.sendStatus(500);
      return;
    }
    const targetUser = await usersQueryRepository.getUserById(
      new ObjectId(userId)
    );

    if (!targetUser) {
      res.sendStatus(404);
      return;
    }

    const myInfo: meModel = {
      email: targetUser.email,
      login: targetUser.login,
      userId: targetUser.id,
    };

    res.status(200).json(myInfo);
  },
};
