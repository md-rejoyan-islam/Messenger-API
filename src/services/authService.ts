import crypto from "crypto";
import createError from "http-errors";
import secret from "../app/secret";
import { resetPasswordMail } from "../mails/resetPasswordMail";
import User from "../models/userModel";

const registerUser = async (name: string, email: string, password: string) => {
  const userExists = await User.findOne({ email });

  if (userExists) {
    throw createError(11000, "User already exists");
  }

  const user = await User.create({
    name,
    email,
    password,
  });

  const { password: _, ...withoutPasword } = user;
  return withoutPasword;
};

const loginUser = async (email: string, password: string) => {
  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    return {
      _id: user._id,
      name: user.name,
      email: user.email,
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
  user.resetPasswordExpires = new Date(Date.now() + 600); // 1000; // 10 minutes

  const resetUrl = `${secret.clientUrl}/reset-password/${resetToken}`;

  try {
    await resetPasswordMail({
      to: user.email,
      name: user.name,
      link: resetUrl,
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
    resetPasswordExpires: { $gt: Date.now() },
  });

  if (!user) {
    throw createError.NotFound("Invalid or expired password reset token");
  }

  user.password = password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;

  await user.save();
};

export { forgotPassword, loginUser, registerUser, resetPassword };
