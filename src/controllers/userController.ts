import { Response } from "express";

import { ObjectId, Types } from "mongoose";
import {
  acceptFriendRequest,
  blockUser,
  cancelFriendRequest,
  changePassword,
  findFriends,
  getAllFriends,
  getAllSentRequests,
  getFriendRequests,
  getUserProfileById,
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

// get friend requests
/**
 * @description Get friend requests for the authenticated user
 * @method GET
 * @route /api/users/friend-requests
 * @success-response 200 {object[]} requests - List of friend requests
 * @error-response 401 {string} message - Not authorized, token failed
 * * @error-response 500 {string} message - Server error
 * @protected Yes
 */
const getFriendRequestController = catchAsync(
  async (req: IUserRequest, res: Response): Promise<void> => {
    const { _id } = req.user!;
    const requests = await getFriendRequests(_id);
    successResponse(res, "Friend requests retrieved successfully", requests);
  }
);

// get all friends
/**
 * @description Get all friends of the authenticated user
 * @method GET
 * @route /api/users/friends
 * @success-response 200 {object[]} friends - List of friends
 * @error-response 401 {string} message - Not authorized, token failed
 * @error-response 500 {string} message - Server error
 * @protected Yes
 */
const getAllFriendsController = catchAsync(
  async (req: IUserRequest, res: Response): Promise<void> => {
    const { _id } = req.user!;
    const friends = await getAllFriends(_id);
    successResponse(res, "Friends retrieved successfully", friends);
  }
);

// get all sending friend requests
/**
 * @description Get all sent friend requests by the authenticated user
 * @method GET
 * @route /api/users/sent-requests
 * @success-response 200 {object[]} requests - List of sent friend requests
 * @error-response 401 {string} message - Not authorized, token failed
 * @error-response 500 {string} message - Server error
 * @protected Yes
 */
const getAllSentRequestsController = catchAsync(
  async (req: IUserRequest, res: Response): Promise<void> => {
    const { _id } = req.user!;
    const requests = await getAllSentRequests(_id);
    successResponse(
      res,
      "Sent friend requests retrieved successfully",
      requests
    );
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
    const { id: userId } = req.params;
    const { _id } = req.user!;

    await sendFriendRequest(_id, new Types.ObjectId(userId));
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
    const { id: userId } = req.params;
    const { _id } = req.user!;

    await acceptFriendRequest(_id, new Types.ObjectId(userId));
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
    const { id: userId } = req.params;
    const { _id } = req.user!;

    await rejectFriendRequest(_id, new Types.ObjectId(userId));
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
    const { id: userId } = req.params;
    const { _id } = req.user!;

    await cancelFriendRequest(_id, new Types.ObjectId(userId));
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
    const { id: userId } = req.params;
    const { _id } = req.user!;

    await unfriendUser(_id, new Types.ObjectId(userId));
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
    const avatar = req.file
      ? req.protocol + "://" + req.host + "/public/" + req.file.filename
      : undefined;

    const { name, bio } = req.body;

    const { _id } = req.user!;

    const user = await updateUserProfile(_id, name, avatar, bio);
    successResponse(res, "Profile updated successfully", user);
  }
);

// get profile controller

/**
 * @description Get user profile by ID
 * @method GET
 * @route /api/user/profile
 * @param {string} id - User ID
 * @success-response 200 {object} user - User profile data
 * @error-response 404 {string} message - User not found
 * @error-response 401 {string} message - Not authorized, token failed
 */

const getUserProfileController = catchAsync(
  async (req: IUserRequest, res: Response): Promise<void> => {
    const { _id } = req.user!;

    // Assuming you have a function to get user profile by ID
    const user = await getUserProfileById(new Types.ObjectId(_id));
    successResponse(res, "User profile retrieved successfully", user);
  }
);

/**
 * @description Find friends by name or email
 * @method GET
 * @route /api/users/find-friends
 * @query {string} q - Search query (name or email)
 * @success-response 200 {object[]} users - List of users matching the search query
 * @error-response 401 {string} message - Not authorized, token failed
 * @protected Yes
 */
const findFriendsController = catchAsync(
  async (req: IUserRequest, res: Response): Promise<void> => {
    const { search = "" } = req.query;
    const { _id } = req.user!;

    const users = await findFriends(
      _id as unknown as ObjectId,
      search as string
    );
    successResponse(res, "Users found", users);
  }
);

const getUserByIdController = catchAsync(
  async (req: IUserRequest, res: Response): Promise<void> => {
    const { id } = req.params;
    const user = await getUserProfileById(new Types.ObjectId(id));
    successResponse(res, "User profile retrieved successfully", user);
  }
);

export {
  acceptFriendRequestController,
  blockUserController,
  cancelFriendRequestController,
  changePasswordController,
  findFriendsController,
  getAllFriendsController,
  getAllSentRequestsController,
  getFriendRequestController,
  getUserByIdController,
  getUserProfileController,
  rejectFriendRequestController,
  sendFriendRequestController,
  unblockUserController,
  unfriendUserController,
  updateUserProfileController,
};
