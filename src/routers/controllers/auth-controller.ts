import { Request, Response } from "express";
import { LoginInputModel } from "../../types/login-types";
import { jwtService } from "../../adapters/jwtService";
import { RequestWithBody } from "../../types/requests-types";
import { usersQueryRepository } from "../../db/mongodb/repositories/users-repository/users-query-repository";
import { ObjectId } from "mongodb";
import { HttpStatuses } from "../../types/http-statuses";
import { authService } from "../../services/auth-service";
import { MeModel, UserInputModel } from "../../types/users-types";

export const authController = {
  async loginUser(
    req: RequestWithBody<LoginInputModel>,
    res: Response<{ accessToken: string }>
  ) {
    const { loginOrEmail, password } = req.body;

    const user = await authService.validateUser({
      loginOrEmail,
      password,
    });

    const token = jwtService.createJwt(user._id);

    res.status(HttpStatuses.Success).json({ accessToken: token });
  },

  async getMyInfo(req: Request, res: Response<MeModel>) {
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

  async registerUser(req: RequestWithBody<UserInputModel>, res: Response) {
    await authService.registerUser({
      email: req.body.email,
      login: req.body.login,
      password: req.body.password,
    });
  },

  async confirmRegistration(req: Request, res: Response) {},
  async resendConfirmation(req: Request, res: Response) {},
};
