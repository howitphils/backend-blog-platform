import { Request, Response } from "express";
import { LoginInputModel } from "../../types/login-types";
import { RequestWithBody } from "../../types/requests-types";
import { usersQueryRepository } from "../../db/mongodb/repositories/users-repository/users-query-repository";
import { ObjectId } from "mongodb";
import { HttpStatuses } from "../../types/http-statuses";
import { authService } from "../../services/auth-service";
import { MeModel, UserInputModel } from "../../types/users-types";
import { SETTINGS } from "../../settings";

export const authController = {
  async loginUser(
    req: RequestWithBody<LoginInputModel>,
    res: Response<{ accessToken: string }>
  ) {
    const { loginOrEmail, password } = req.body;
    const ip = req.ip || "unknown";
    const device_name = req.headers["user-agent"] || "default_device";

    const { accessToken, refreshToken } = await authService.loginUser({
      usersCredentials: {
        loginOrEmail,
        password,
      },
      usersConfigs: {
        ip,
        device_name,
      },
    });

    res.cookie(SETTINGS.REFRESH_TOKEN_COOKIE_NAME, refreshToken, {
      httpOnly: true,
      secure: true,
      path: "/auth",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(HttpStatuses.Success).json({ accessToken });
  },

  async createNewTokenPair(req: Request, res: Response) {
    const token = req.cookies[SETTINGS.REFRESH_TOKEN_COOKIE_NAME];
    const userId = req.user?.id;

    if (!userId) {
      res.sendStatus(HttpStatuses.ServerError);
      return;
    }

    const { accessToken, refreshToken } = await authService.refreshTokens(
      userId,
      token
    );

    res.cookie(SETTINGS.REFRESH_TOKEN_COOKIE_NAME, refreshToken, {
      httpOnly: true,
      secure: true,
      path: "/auth",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(HttpStatuses.Success).json({ accessToken });
  },

  async logout(req: Request, res: Response) {
    const userId = req.user?.id;
    const token = req.cookies[SETTINGS.REFRESH_TOKEN_COOKIE_NAME];

    if (!userId) {
      res.sendStatus(HttpStatuses.ServerError);
      return;
    }

    await authService.logout(userId, token);

    // httpOnly, path, secure должны быть такими же как при создании
    res.clearCookie(SETTINGS.REFRESH_TOKEN_COOKIE_NAME, {
      httpOnly: true,
      secure: true,
      path: "/auth",
    });

    res.sendStatus(HttpStatuses.NoContent);
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
