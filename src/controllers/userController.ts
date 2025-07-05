import { Response } from "express";

import {
  acceptFriendRequest,
  blockUser,
  cancelFriendRequest,
  changePassword,
  rejectFriendRequest,
  sendFriendRequest,
  unblockUser,
  unfriendUser,
  updateUserProfile,
} from "../services/userService";
import catchAsync from "../utils/catchAsync";
import { successResponse } from "../utils/responseHandler";
import { IUserRequest } from "../utils/types";

/**
 * @description Change user password
 * @method PUT
 * @route /api/auth/change-password
 * @body {object} - Password change details
 * @body {string} .oldPassword - Required. User's current password
 * @body {string} .newPassword - Required. User's new password
 * @success-response 200 {object} { success: true, message: string } - Password changed successfully
 * @error-response 401 {object} { success: false, message: string, error: object } - Not authorized, token failed / Invalid old password
 * @protected Yes
 */
const changePasswordController = catchAsync(
  async (req: IUserRequest, res: Response): Promise<void> => {
    const { oldPassword, newPassword } = req.body;
    const { _id } = req.user!;

    await changePassword(_id, oldPassword, newPassword);
    successResponse(res, "Password changed successfully");
  }
);

/**
 * @description Send a friend request
 * @method POST
 * @route /api/users/friend-request
 * @body {string} userId - ID of the user to send a friend request to
 * @success-response 200 {string} message - Friend request sent
 * @error-response 401 {string} message - Not authorized, token failed
 * @error-response 500 {string} message - Server error
 * @protected Yes
 */
const sendFriendRequestController = catchAsync(
  async (req: IUserRequest, res: Response): Promise<void> => {
    const { userId } = req.body;
    const { _id } = req.user!;

    await sendFriendRequest(_id, userId);
    successResponse(res, "Friend request sent");
  }
);

/**
 * @description Accept a friend request
 * @method POST
 * @route /api/users/friend-request/accept
 * @body {string} userId - ID of the user whose friend request to accept
 * @success-response 200 {string} message - Friend request accepted
 * @error-response 401 {string} message - Not authorized, token failed
 * @error-response 500 {string} message - Server error
 * @protected Yes
 */
const acceptFriendRequestController = catchAsync(
  async (req: IUserRequest, res: Response): Promise<void> => {
    const { userId } = req.body;
    const { _id } = req.user!;

    await acceptFriendRequest(_id, userId);
    successResponse(res, "Friend request accepted");
  }
);

/**
 * @description Reject a friend request
 * @method POST
 * @route /api/users/friend-request/reject
 * @body {string} userId - ID of the user whose friend request to reject
 * @success-response 200 {string} message - Friend request rejected
 * @error-response 401 {string} message - Not authorized, token failed
 * @error-response 500 {string} message - Server error
 * @protected Yes
 */
const rejectFriendRequestController = catchAsync(
  async (req: IUserRequest, res: Response): Promise<void> => {
    const { userId } = req.body;
    const { _id } = req.user!;

    await rejectFriendRequest(_id, userId);
    successResponse(res, "Friend request rejected");
  }
);

/**
 * @description Cancel a sent friend request
 * @method POST
 * @route /api/users/friend-request/cancel
 * @body {string} userId - ID of the user to whom the friend request was sent
 * @success-response 200 {string} message - Friend request cancelled
 * @error-response 401 {string} message - Not authorized, token failed
 * @error-response 500 {string} message - Server error
 * @protected Yes
 */
const cancelFriendRequestController = catchAsync(
  async (req: IUserRequest, res: Response): Promise<void> => {
    const { userId } = req.body;
    const { _id } = req.user!;

    await cancelFriendRequest(_id, userId);
    successResponse(res, "Friend request cancelled");
  }
);

/**
 * @description Unfriend a user
 * @method POST
 * @route /api/users/unfriend
 * @body {string} userId - ID of the user to unfriend
 * @success-response 200 {string} message - User unfriended
 * @error-response 401 {string} message - Not authorized, token failed
 * @error-response 500 {string} message - Server error
 * @protected Yes
 */
const unfriendUserController = catchAsync(
  async (req: IUserRequest, res: Response): Promise<void> => {
    const { userId } = req.body;
    const { _id } = req.user!;

    await unfriendUser(_id, userId);
    successResponse(res, "User unfriended");
  }
);

const blockUserController = catchAsync(
  async (req: IUserRequest, res: Response): Promise<void> => {
    const { userId } = req.body;
    const { _id } = req.user!;

    await blockUser(_id, userId);
    successResponse(res, "User blocked successfully");
  }
);

const unblockUserController = catchAsync(
  async (req: IUserRequest, res: Response): Promise<void> => {
    const { userId } = req.body;
    const { _id } = req.user!;

    await unblockUser(_id, userId);
    successResponse(res, "User unblocked successfully");
  }
);

/**
 * @description Update user profile
 * @method PUT
 * @route /api/auth/profile
 * @body {object} - User profile details
 * @body {string} .name - Optional. User's name
 * @body {string} .profilePhoto - Optional. URL of user's profile photo
 * @success-response 200 {object} { success: true, message: string, data: object } - Updated user data
 * @error-response 401 {object} { success: false, message: string, error: object } - Not authorized, token failed
 * @error-response 404 {object} { success: false, message: string, error: object } - User not found
 * @protected Yes
 */

const updateUserProfileController = catchAsync(
  async (req: IUserRequest, res: Response): Promise<void> => {
    const { name, profilePhoto, bio } = req.body;
    const { _id } = req.user!;

    const user = await updateUserProfile(_id, name, profilePhoto, bio);
    successResponse(res, "Profile updated successfully", user);
  }
);

export {
  acceptFriendRequestController,
  blockUserController,
  cancelFriendRequestController,
  changePasswordController,
  rejectFriendRequestController,
  sendFriendRequestController,
  unblockUserController,
  unfriendUserController,
  updateUserProfileController,
};
