import { Request, Response } from "express";
import secret from "../app/secret";
import {
  forgotPassword,
  loginUser,
  refreshToken,
  registerUser,
  resetPassword,
} from "../services/authService";
import catchAsync from "../utils/catchAsync";
import { clearCookie, setCookie } from "../utils/cookies";
import { successResponse } from "../utils/responseHandler";

/**
 * @description Register a new user
 * @method POST
 * @route /api/auth/register
 * @body {object} - User registration details
 * @body {string} .name - Required. User's name
 * @body {string} .email - Required. User's email
 * @body {string} .password - Required. User's password
 * @success-response 201 {object} { success: true, message: string, data: object } - Registered user data with token
 * @error-response 400 {object} { success: false, message: string, error: object } - Invalid input or user already exists
 * @protected No
 */
const registerUserController = catchAsync(
  async (req: Request, res: Response): Promise<void> => {
    const { name, email, password } = req.body;

    const user = await registerUser(name, email, password);
    successResponse(res, "User registered successfully", user, 201);
  }
);

/**
 * @description Log in an existing user
 * @method POST
 * @route /api/auth/login
 * @body {object} - User login credentials
 * @body {string} .email - Required. User's email
 * @body {string} .password - Required. User's password
 * @success-response 200 {object} { success: true, message: string, data: object } - Logged in user data with token
 * @error-response 401 {object} { success: false, message: string, error: object } - Invalid email or password
 * @protected No
 */
const loginUserController = catchAsync(
  async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body;

    const user = await loginUser(email, password);

    // cookie set in the response header
    setCookie(res, {
      name: "refreshToken",
      value: user.refreshToken,
      maxAge: secret.jwt.refreshTokenExpiresIn * 1000, // convert to milliseconds
    });
    setCookie(res, {
      name: "accessToken",
      value: user.accessToken,
      maxAge: secret.jwt.accessTokenExpiresIn * 1000, // convert to milliseconds
    });

    successResponse(res, "User logged in successfully", user);
  }
);

/**
 * @description Request a password reset
 * @method POST
 * @route /api/auth/forgot-password
 * @body {object} - User's email for password reset
 * @body {string} .email - Required. User's email
 * @success-response 200 {object} { success: true, message: string } - Email sent
 * @error-response 500 {object} { success: false, message: string, error: object } - Server error
 * @protected No
 */
const forgotPasswordController = catchAsync(
  async (req: Request, res: Response): Promise<void> => {
    const { email } = req.body;

    await forgotPassword(email);
    successResponse(res, "Password reset email sent successfully");
  }
);

/**
 * @description Reset user password
 * @method PUT
 * @route /api/auth/reset-password/:token
 * @param {string} token - Password reset token
 * @body {object} - New password details
 * @body {string} .password - Required. New password
 * @success-response 200 {object} { success: true, message: string } - Password updated
 * @error-response 400 {object} { success: false, message: string, error: object } - Invalid or expired token
 * @protected No
 */
const resetPasswordController = catchAsync(
  async (req: Request, res: Response): Promise<void> => {
    const { token } = req.params;
    const { password } = req.body;

    await resetPassword(token, password);
    successResponse(res, "Password updated successfully");
  }
);

/*
 * @description Refresh user token
 * @method GET
 * @route /api/auth/refresh-token
 * @success-response 200 {object} { success: true, message: string, data: object } - New token data
 * @error-response 401 {object} { success: false, message: string, error: object } - Unauthorized
 * @protected No
 */

const refreshTokenController = catchAsync(
  async (req: Request, res: Response): Promise<void> => {
    const { accessToken } = await refreshToken(req.body.refreshToken);

    // Set new access token in cookies
    setCookie(res, {
      name: "accessToken",
      value: accessToken,
      maxAge: secret.jwt.accessTokenExpiresIn * 1000, // convert to milliseconds
    });

    successResponse(res, "Token refreshed successfully", {
      accessToken,
    });
  }
);

const logout = catchAsync(
  async (_req: Request, res: Response): Promise<void> => {
    // Clear cookies
    clearCookie(res, "refreshToken");
    clearCookie(res, "accessToken");

    successResponse(res, "User logged out successfully");
  }
);

export {
  loginUserController,
  registerUserController,
  logout,
  forgotPasswordController,
  resetPasswordController,
  refreshTokenController,
};
