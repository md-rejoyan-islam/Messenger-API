import createError from "http-errors";
import { ObjectId, Types } from "mongoose";
import User from "../models/userModel";

const changePassword = async (
  userId: Types.ObjectId,
  oldPassword: string,
  newPassword: string
) => {
  const user = await User.findById(userId);

  if (!user) {
    throw createError(404, "User not found");
  }

  if (await user.matchPassword(newPassword)) {
    throw createError(
      400,
      "New password cannot be the same as the old password"
    );
  }

  if (!(await user.matchPassword(oldPassword))) {
    throw createError(401, "Invalid old password");
  }

  user.password = newPassword;
  await user.save();
};

// get all friends
const getAllFriends = async (userId: Types.ObjectId) => {
  const user = await User.findById(userId)
    .populate("friends", "name profilePhoto")
    .select("friends");
  if (!user) {
    throw createError(404, "User not found");
  }
  return (user.friends as any[]).map((friend) => ({
    _id: friend._id,
    name: friend.name,
    profilePhoto: friend.profilePhoto,
  }));
};

// get all sent friend requests
const getAllSentRequests = async (userId: Types.ObjectId) => {
  const user = await User.findById(userId)
    .populate("sentFriendRequests", "name profilePhoto")
    .select("sentFriendRequests");
  if (!user) {
    throw createError(404, "User not found");
  }
  return (user.sentFriendRequests as any[]).map((request) => ({
    _id: request._id,
    name: request.name,
    profilePhoto: request.profilePhoto,
  }));
};

const sendFriendRequest = async (
  senderId: Types.ObjectId,
  recipientId: Types.ObjectId
) => {
  const user = await User.findById(senderId);
  if (!user) {
    throw createError(404, "User not found");
  }
  await User.findByIdAndUpdate(recipientId, {
    $push: { friendRequests: senderId },
  });
  await User.findByIdAndUpdate(senderId, {
    $push: { sentFriendRequests: recipientId },
  });
};

const acceptFriendRequest = async (
  currentUserId: Types.ObjectId,
  friendId: Types.ObjectId
) => {
  const user = await User.findById(friendId);
  if (!user) {
    throw createError(404, "User not found");
  }
  await User.findByIdAndUpdate(friendId, {
    $pull: { sentFriendRequests: currentUserId },
    $push: { friends: currentUserId },
  });
  await User.findByIdAndUpdate(currentUserId, {
    $pull: { friendRequests: friendId },
    $push: { friends: friendId },
  });
};

const rejectFriendRequest = async (
  currentUserId: Types.ObjectId,
  friendId: Types.ObjectId
) => {
  const user = await User.findById(friendId);
  if (!user) {
    throw createError(404, "User not found");
  }
  await User.findByIdAndUpdate(friendId, {
    $pull: { sentFriendRequests: currentUserId },
  });
  await User.findByIdAndUpdate(currentUserId, {
    $pull: { friendRequests: friendId },
  });
};

const cancelFriendRequest = async (
  currentUserId: Types.ObjectId,
  friendId: Types.ObjectId
) => {
  const user = await User.findById(friendId);
  if (!user) {
    throw createError(404, "User not found");
  }

  await User.findByIdAndUpdate(friendId, {
    $pull: { friendRequests: currentUserId },
  });
  await User.findByIdAndUpdate(currentUserId, {
    $pull: { sentFriendRequests: friendId },
  });
};

const unfriendUser = async (
  currentUserId: Types.ObjectId,
  friendId: Types.ObjectId
) => {
  const user = await User.findById(friendId);
  if (!user) {
    throw createError(404, "User not found");
  }
  await User.findByIdAndUpdate(friendId, { $pull: { friends: currentUserId } });
  await User.findByIdAndUpdate(currentUserId, { $pull: { friends: friendId } });
};

const blockUser = async (
  currentUserId: Types.ObjectId,
  userIdToBlock: Types.ObjectId
) => {
  const user = await User.findById(userIdToBlock);
  if (!user) {
    throw createError(404, "User not found");
  }
  await User.findByIdAndUpdate(currentUserId, {
    $push: { blockedUsers: userIdToBlock },
  });
};

const unblockUser = async (
  currentUserId: Types.ObjectId,
  userIdToUnblock: Types.ObjectId
) => {
  const user = await User.findById(userIdToUnblock);
  if (!user) {
    throw createError(404, "User not found");
  }
  await User.findByIdAndUpdate(currentUserId, {
    $pull: { blockedUsers: userIdToUnblock },
  });
};
const updateUserProfile = async (
  userId: Types.ObjectId,
  name: string,
  profilePhoto: string,
  bio: string
) => {
  const user = await User.findById(userId);

  if (!user) {
    throw createError(404, "User not found");
  }

  user.name = name || user.name;
  user.profilePhoto = profilePhoto || user.profilePhoto;
  user.bio = bio || user.bio;

  const updatedUser = await user.save();

  return {
    _id: updatedUser._id,
    name: updatedUser.name,
    email: updatedUser.email,
    profilePhoto: updatedUser.profilePhoto,
    bio: updatedUser.bio,
  };
};

const findFriends = async (userId: ObjectId, query?: string) => {
  const filterOptions: any = {
    _id: { $ne: userId },
  };
  if (query) {
    const regex = new RegExp(query, "i");
    filterOptions.$or = [
      { name: { $regex: regex } },
      // { email: { $regex: regex } }, // Uncomment if you want to search by email
    ];
  }

  const users = await User.find(filterOptions).select(
    "-password -friendRequests -blockedUsers"
  );

  return users.map((user) => ({
    _id: user._id,
    name: user.name,
    profilePhoto: user.profilePhoto,
    isFriend: user.friends.includes(userId),
    hasSentRequest: user.sentFriendRequests.includes(userId),
  }));
};

const getFriendRequests = async (userId: Types.ObjectId) => {
  const user = await User.findById(userId)
    .populate("friendRequests", "name profilePhoto")
    .select("friendRequests");
  if (!user) {
    throw createError(404, "User not found");
  }
  return (user.friendRequests as any[]).map((request) => ({
    _id: request._id,
    name: request.name,
    profilePhoto: request.profilePhoto,
  }));
};

export {
  acceptFriendRequest,
  blockUser,
  cancelFriendRequest,
  changePassword,
  findFriends,
  getAllFriends,
  getAllSentRequests,
  getFriendRequests,
  rejectFriendRequest,
  sendFriendRequest,
  unblockUser,
  unfriendUser,
  updateUserProfile,
};
