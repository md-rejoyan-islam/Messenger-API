import * as crypto from "crypto";
import createError from "http-errors";
import jwt, { JwtPayload } from "jsonwebtoken";
import secret from "../app/secret";
import { sendPasswordResetMail } from "../mails/passwordResetMail";
import User from "../models/userModel";
import { generateTokens } from "../utils/jwt";

const registerUser = async (name: string, email: string, password: string) => {
  const userExists = await User.findOne({ email });

  if (userExists) {
    throw createError(409, "User already exists");
  }

  const user = await User.create({
    name,
    email,
    password,
  });

  // send welcome email

  const { password: _, ...withoutPasword } = user.toObject();
  return withoutPasword;
};

const loginUser = async (email: string, password: string) => {
  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    const { accessToken, refreshToken } = generateTokens({
      id: user._id.toString(),
      email: user.email,
    });

    return {
      accessToken,
      refreshToken,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        profilePhoto: user.profilePhoto,
        bio: user.bio,
      },
    };
  } else {
    throw createError.Unauthorized("Invalid email or password");
  }
};

const forgotPassword = async (email: string) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw createError.NotFound("User not found");
  }

  const resetToken = crypto.randomBytes(20).toString("hex");

  const hashToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  user.resetPasswordToken = hashToken;

  user.resetPasswordExpires = new Date(
    Date.now() + secret.passwordResetTokenExpiration * 1000
  );

  const resetUrl = `${secret.clientUrl}/reset-password/?token=${resetToken}`;

  try {
    await sendPasswordResetMail({
      to: user.email,
      name: user.name,
      resetLink: resetUrl,
    });
    await user.save();
  } catch (error) {
    throw createError.InternalServerError("Error sending email");
  }
};

const resetPassword = async (token: string, password: string) => {
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpires: { $gt: new Date(Date.now()) },
  });

  if (!user) {
    throw createError.NotFound("Invalid or expired password reset token");
  }

  user.password = password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;

  await user.save();
};

//  refreshToken
const refreshToken = async (token: string) => {
  try {
    const decoded = jwt.verify(
      token,
      secret.jwt.refreshTokenSecret as string
    ) as JwtPayload as { id: string; email: string };

    if (!decoded) {
      throw createError.Unauthorized("Invalid refresh token");
    }

    const { id, email } = decoded;

    const user = await User.findOne({ _id: id, email });
    if (!user) {
      throw createError.Unauthorized("User not found");
    }
    const { accessToken } = generateTokens({
      id: user._id.toString(),
      email: user.email,
    });

    return {
      accessToken,
    };
  } catch (error) {
    throw createError.Unauthorized("Invalid refresh token");
  }
};

export { forgotPassword, loginUser, refreshToken, registerUser, resetPassword };
