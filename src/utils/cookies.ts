import { Response } from "express";
import secret from "../app/secret";

export const setCookie = (
  res: Response,
  { name, value, maxAge }: { name: string; value: string; maxAge: number }
): void => {
  res.cookie(name, value, {
    maxAge,
    httpOnly: true,
    secure: secret.nodeEnv === "production",
    sameSite: "strict",
  });
};

export const clearCookie = (res: Response, name: string): void => {
  res.clearCookie(name, {
    httpOnly: true,
    secure: secret.nodeEnv === "production",
    sameSite: "strict",
  });
};
