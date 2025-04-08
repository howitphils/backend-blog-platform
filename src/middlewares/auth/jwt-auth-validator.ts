import { Response, NextFunction, Request } from "express";
import { jwtService } from "../../application/jwtService";

// type RequestWithUserId<U extends { id: string }> = Request<{}, {}, {}, {}, U>;

export const jwtAuthGuard = (
  req: Request<{}>,
  res: Response,
  next: NextFunction
) => {
  if (!req.headers.authorization) {
    console.log("no headers");

    res.sendStatus(401);
    return;
  }

  const [authType, token] = req.headers.authorization.split(" ");

  if (authType !== "Bearer") {
    console.log("wrong type");

    res.sendStatus(401);
    return;
  }

  const verifiedUser = jwtService.verifyToken(token);

  if (!verifiedUser) {
    console.log("not verified");
    res.sendStatus(401);
    return;
  }

  req.user = { id: verifiedUser.userId };

  next();
};
