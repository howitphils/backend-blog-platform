import { Request, Response } from "express";
import { LoginInputModel } from "../../types/login-types";
import { RequestWithBody } from "../../types/requests-types";
import { usersQueryRepository } from "../../db/mongodb/repositories/users-repository/users-query-repository";
import { ObjectId } from "mongodb";
import { HttpStatuses } from "../../types/http-statuses";
import { authService } from "../../services/auth-service";
import { MeModel, UserInputModel } from "../../types/users-types";
import { APP_CONFIG } from "../../settings";

class AuthController {
  async loginUser(
    req: RequestWithBody<LoginInputModel>,
    res: Response<{ accessToken: string }>
  ) {
    const { loginOrEmail, password } = req.body;
    const ip = req.ip || "unknown";
    const device_name = req.headers["user-agent"] || "default_device_name";

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

    res.cookie(APP_CONFIG.REFRESH_TOKEN_COOKIE_NAME, refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(HttpStatuses.Success).json({ accessToken });
  }

  async refreshTokens(req: Request, res: Response) {
    const userId = req.user?.id;
    const deviceId = req.user?.deviceId;
    const issuedAt = req.user?.iat;

    if (!userId || !deviceId || !issuedAt) {
      res.sendStatus(HttpStatuses.ServerError);
      console.log("user is not found in request");
      return;
    }

    const { accessToken, refreshToken } = await authService.refreshTokens({
      userId,
      deviceId,
      issuedAt,
    });

    res.cookie(APP_CONFIG.REFRESH_TOKEN_COOKIE_NAME, refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(HttpStatuses.Success).json({ accessToken });
  }

  async logout(req: Request, res: Response) {
    const userId = req.user?.id;
    const issuedAt = req.user?.iat;
    const deviceId = req.user?.deviceId;

    if (!userId || !deviceId || !issuedAt) {
      res.sendStatus(HttpStatuses.ServerError);
      console.log("user is not found in request");
      return;
    }

    await authService.logout({ userId, deviceId, issuedAt });

    // httpOnly, path, secure должны быть такими же как при создании
    res.clearCookie(APP_CONFIG.REFRESH_TOKEN_COOKIE_NAME, {
      httpOnly: true,
      secure: true,
    });

    res.sendStatus(HttpStatuses.NoContent);
  }

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
  }

  async registerUser(req: RequestWithBody<UserInputModel>, res: Response) {
    await authService.registerUser({
      email: req.body.email,
      login: req.body.login,
      password: req.body.password,
    });

    res.sendStatus(HttpStatuses.NoContent);
  }

  async confirmRegistration(
    req: RequestWithBody<{ code: string }>,
    res: Response
  ) {
    const code = req.body.code;

    await authService.confirmRegistration(code);

    res.sendStatus(HttpStatuses.NoContent);
  }

  async resendConfirmation(
    req: RequestWithBody<{ email: string }>,
    res: Response
  ) {
    const email = req.body.email;

    await authService.resendConfirmationCode(email);

    res.sendStatus(HttpStatuses.NoContent);
  }

  async recoverPassword(
    req: RequestWithBody<{ email: string }>,
    res: Response
  ) {
    const email = req.body.email;

    await authService.recoverPassword(email);

    res.sendStatus(HttpStatuses.NoContent);
  }

  async confirmPasswordRecovery(
    req: RequestWithBody<{ newPassword: string; recoveryCode: string }>,
    res: Response
  ) {
    const { newPassword, recoveryCode } = req.body;

    await authService.confirmPasswordRecovery(newPassword, recoveryCode);

    res.sendStatus(HttpStatuses.NoContent);
  }
}

export const authController = new AuthController();
