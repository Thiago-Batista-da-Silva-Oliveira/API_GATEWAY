import { Request, Response, NextFunction } from "express";
import { verify } from "jsonwebtoken";

export function ensureAuthenticated(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const authToken = req.headers.authorization;

  if (!authToken) {
    return res.status(401).json({
      errorCode: "token invalid",
    });
  }

  const [, token] = authToken.split(" ");

  try {
    verify(token, process.env.JWT_SECRET);
    return next();
  } catch (err) {
    return res.status(401).json({ errorCode: "token expired" });
  }
}
