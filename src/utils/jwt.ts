import jwt from "jsonwebtoken";
import secret from "../app/secret";

export const generateTokens = (payload: {
  id: string;
  email: string;
}): {
  accessToken: string;
  refreshToken: string;
} => {
  const { id, email } = payload;
  const accessToken = jwt.sign(
    { id, email },
    secret.jwt.accessTokenSecret as string,
    { expiresIn: secret.jwt.accessTokenExpiresIn }
  );

  const refreshToken = jwt.sign(
    { id, email },
    secret.jwt.refreshTokenSecret as string,
    { expiresIn: secret.jwt.refreshTokenExpiresIn }
  );

  return { accessToken, refreshToken };
};
