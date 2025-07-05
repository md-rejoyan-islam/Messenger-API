import createError from "http-errors";
import { Types } from "mongoose";
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

export {
  acceptFriendRequest,
  blockUser,
  cancelFriendRequest,
  changePassword,
  rejectFriendRequest,
  sendFriendRequest,
  unblockUser,
  unfriendUser,
  updateUserProfile,
};
