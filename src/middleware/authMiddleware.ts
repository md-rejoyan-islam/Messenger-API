import { NextFunction, Request, Response } from "express";
import createError from "http-errors";
import * as jwt from "jsonwebtoken";
import { Types } from "mongoose";
import secret from "../app/secret";
import User from "../models/userModel";

interface DecodedToken {
  id: Types.ObjectId;
}

interface IUserRequest extends Request {
  user?: typeof User.prototype;
}

const protect = async (
  req: IUserRequest,
  _res: Response,
  next: NextFunction,
): Promise<void> => {
  const token: string | undefined =
    req.cookies?.accessToken || req.headers?.authorization?.split(" ")[1];

  if (!token) {
    throw createError.Unauthorized("Not authorized, no token");
  }

  try {
    const decoded = jwt.verify(
      token,
      secret.jwt.accessTokenSecret as string,
    ) as DecodedToken;

    const user = await User.findById(decoded.id).select(
      "_id name email avatar bio",
    );

    if (!user) {
      throw createError.Unauthorized("Not authorized, user not found");
    }

    req.user = user;
    next();
  } catch {
    throw createError.Unauthorized("Not authorized, token failed");
  }
};

export { protect };
