import { Request, Response } from "express";
import { LoginInputModel } from "../../types/login-types";
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

    const { accessToken, refreshToken } = await authService.loginUser({
      loginOrEmail,
      password,
    });

    res.cookie("refresh", refreshToken, {
      httpOnly: true,
      secure: true,
      path: "/auth",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(HttpStatuses.Success).json({ accessToken });
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

    res.sendStatus(HttpStatuses.NoContent);
  },

  async confirmRegistration(
    req: RequestWithBody<{ code: string }>,
    res: Response
  ) {
    const code = req.body.code;

    await authService.confirmRegistration(code);

    res.sendStatus(HttpStatuses.NoContent);
  },

  async resendConfirmation(
    req: RequestWithBody<{ email: string }>,
    res: Response
  ) {
    const email = req.body.email;

    await authService.resendConfirmationCode(email);

    res.sendStatus(HttpStatuses.NoContent);
  },
};
