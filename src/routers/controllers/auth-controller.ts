import { Request, Response } from "express";
import { LoginInputModel } from "../../types/login-types";
import { usersService } from "../../services/users-service";
import { jwtService } from "../../application/jwtService";
import { RequestWithBody } from "../../types/requests-types";
import { usersQueryRepository } from "../../db/mongodb/repositories/users-repository/users-query-repository";
import { ObjectId } from "mongodb";
import { HttpStatuses } from "../../types/http-statuses";

export const authController = {
  async loginUser(req: RequestWithBody<LoginInputModel>, res: Response) {
    const { loginOrEmail, password } = req.body;

    const user = await usersService.validateUser({
      loginOrEmail,
      password,
    });

    if (!user) {
      res.sendStatus(HttpStatuses.Unauthorized);
      return;
    }

    const token = jwtService.createJwt(user._id);

    res.status(HttpStatuses.Success).json({ accessToken: token });
  },

  async getMyInfo(req: Request, res: Response) {
    const userId = req.user?.id;
    if (!userId) {
      res.sendStatus(HttpStatuses.ServerError);
      return;
    }
    const myInfo = await usersQueryRepository.getMyInfo(new ObjectId(userId));

    if (!myInfo) {
      res.sendStatus(HttpStatuses.NotFound);
      return;
    }

    res.status(HttpStatuses.Success).json(myInfo);
  },
};
