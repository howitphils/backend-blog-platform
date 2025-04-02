import { Request, Response } from "express";
import { LoginInputModel } from "../../types/login-types";
import { usersService } from "../../services/users-service";
import { jwtService } from "../../application/jwtService";

export const authController = {
  async checkUser(req: Request<{}, {}, LoginInputModel>, res: Response) {
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

    res.status(204).json({ accessToken: token });
  },
};
