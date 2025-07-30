/* eslint-disable @typescript-eslint/no-explicit-any */
import createError from 'http-errors';
import { ObjectId, Types } from 'mongoose';
import User from '../models/userModel';

const changePassword = async (
  userId: Types.ObjectId,
  oldPassword: string,
  newPassword: string,
) => {
  const user = await User.findById(userId);

  if (!user) {
    throw createError(404, 'User not found');
  }

  if (await user.matchPassword(newPassword)) {
    throw createError(
      400,
      'New password cannot be the same as the old password',
    );
  }

  if (!(await user.matchPassword(oldPassword))) {
    throw createError(400, 'Invalid old password');
  }

  user.password = newPassword;
  await user.save();
};

// get all friends
const getAllFriends = async (userId: Types.ObjectId) => {
  const user = await User.findById(userId)
    .populate('friends', 'name avatar online lastSeen ')
    .select('friends');
  if (!user) {
    throw createError(404, 'User not found');
  }

  return (user.friends as any[]).map((friend) => ({
    _id: friend._id,
    name: friend.name,
    avatar: friend.avatar,
    online: friend.online,
    lastSeen: friend.lastSeen,
  }));
};

// get all sent friend requests
const getAllSentRequests = async (userId: Types.ObjectId) => {
  const user = await User.findById(userId)
    .populate('sentFriendRequests.user', 'name profilePhoto')
    .select('sentFriendRequests');
  if (!user) {
    throw createError(404, 'User not found');
  }
  return (user.sentFriendRequests as any[]).map((request) => ({
    _id: request.user._id,
    name: request.user.name,
    profilePhoto: request.user.profilePhoto,
    createdAt: request.createdAt,
  }));
};

const sendFriendRequest = async (
  senderId: Types.ObjectId,
  recipientId: Types.ObjectId,
) => {
  const user = await User.findById(senderId);
  if (!user) {
    throw createError(404, 'User not found');
  }

  if (
    user.sentFriendRequests
      .map((request) => request.user.toString())
      .includes(recipientId.toString())
  ) {
    throw createError(409, 'Friend request already sent');
  }

  const recipient = await User.findById(recipientId);
  if (!recipient) {
    throw createError(404, 'Recipient not found');
  }

  await User.findByIdAndUpdate(recipientId, {
    $push: { friendRequests: { user: senderId } },
  });
  await User.findByIdAndUpdate(senderId, {
    $push: { sentFriendRequests: { user: recipientId } },
  });
};

const acceptFriendRequest = async (
  currentUserId: Types.ObjectId,
  friendId: Types.ObjectId,
) => {
  const user = await User.findById(friendId);
  if (!user) {
    throw createError(404, 'Friend not found');
  }

  await User.findByIdAndUpdate(friendId, {
    $pull: { sentFriendRequests: { user: currentUserId } },
    $push: { friends: currentUserId },
  });
  await User.findByIdAndUpdate(currentUserId, {
    $pull: { friendRequests: { user: friendId } },
    $push: { friends: friendId },
  });
};

const rejectFriendRequest = async (
  currentUserId: Types.ObjectId,
  friendId: Types.ObjectId,
) => {
  const user = await User.findById(friendId).select('sentFriendRequests');
  if (!user) {
    throw createError(404, 'User not found');
  }

  if (
    !user.sentFriendRequests.some(
      (request) => request.user.toString() === currentUserId.toString(),
    )
  ) {
    throw createError(404, 'Friend request not found');
  }

  await User.findByIdAndUpdate(friendId, {
    $pull: { sentFriendRequests: { user: currentUserId } },
  });
  await User.findByIdAndUpdate(currentUserId, {
    $pull: { friendRequests: { user: friendId } },
  });
};

const cancelFriendRequest = async (
  currentUserId: Types.ObjectId,
  friendId: Types.ObjectId,
) => {
  const user = await User.findById(friendId).select('friendRequests');
  if (!user) {
    throw createError(404, 'Friend not found');
  }

  if (
    !user.friendRequests.some(
      (request) => request.user.toString() === currentUserId.toString(),
    )
  ) {
    throw createError(404, 'Friend request not found');
  }

  await User.findByIdAndUpdate(friendId, {
    $pull: { friendRequests: { user: currentUserId } },
  });
  await User.findByIdAndUpdate(currentUserId, {
    $pull: { sentFriendRequests: { user: friendId } },
  });
};

const unfriendUser = async (
  currentUserId: Types.ObjectId,
  friendId: Types.ObjectId,
) => {
  const user = await User.findById(friendId).select('friends');
  if (!user) {
    throw createError(404, 'Friend not found');
  }

  if (
    !user.friends.some(
      (friendId) => friendId.toString() === currentUserId.toString(),
    )
  ) {
    throw createError(404, 'User is not a friend');
  }

  await User.findByIdAndUpdate(friendId, { $pull: { friends: currentUserId } });
  await User.findByIdAndUpdate(currentUserId, { $pull: { friends: friendId } });
};

const blockUser = async (
  currentUserId: Types.ObjectId,
  userIdToBlock: Types.ObjectId,
) => {
  const user = await User.findById(userIdToBlock);
  if (!user) {
    throw createError(404, 'User not found');
  }
  await User.findByIdAndUpdate(currentUserId, {
    $push: { blockedUsers: userIdToBlock },
  });
};

const unblockUser = async (
  currentUserId: Types.ObjectId,
  userIdToUnblock: Types.ObjectId,
) => {
  const user = await User.findById(userIdToUnblock);
  if (!user) {
    throw createError(404, 'User not found');
  }
  await User.findByIdAndUpdate(currentUserId, {
    $pull: { blockedUsers: userIdToUnblock },
  });
};
const updateUserProfile = async (
  userId: Types.ObjectId,
  name: string,
  avatar?: string,
  bio?: string,
) => {
  const user = await User.findById(userId);

  if (!user) {
    throw createError(404, 'User not found');
  }

  user.name = name || user.name;
  user.avatar = avatar || user.avatar;
  user.bio = bio || user.bio;

  const updatedUser = await user.save();

  return {
    _id: updatedUser._id,
    name: updatedUser.name,
    email: updatedUser.email,
    avatar: updatedUser.avatar,
    bio: updatedUser.bio,
  };
};

// get user profile
const getUserProfileById = async (userId: Types.ObjectId) => {
  const user = await User.findById(userId).select(
    '-password -blockedUsers  -sentFriendRequests -online -__v',
  );
  if (!user) {
    throw createError(404, 'User not found');
  }

  return {
    _id: user._id,
    name: user.name,
    avatar: user.avatar,
    bio: user.bio,

    email: user.email,
    friends: user.friends.length,
  };
};

const findFriends = async (userId: ObjectId, query?: string) => {
  const user = await User.findById(userId).select(
    'friends sentFriendRequests friendRequests',
  );

  if (!user) {
    throw createError(404, 'User not found');
  }

  const filterOptions: any = {
    _id: {
      $ne: userId,
      $nin: [
        ...user.sentFriendRequests.map((request) => request.user),
        ...user.friends,
      ],
    },
  };
  if (query) {
    const regex = new RegExp(query, 'i');
    filterOptions.$or = [
      { name: { $regex: regex } },
      // { email: { $regex: regex } }, // Uncomment if you want to search by email
    ];
  }

  const users = await User.find(filterOptions).select(
    '-password -friends -friendRequests -blockedUsers -email -sentFriendRequests -online -__v',
  );

  return users;
};

const getFriendRequests = async (userId: Types.ObjectId) => {
  const user = await User.findById(userId)
    .populate('friendRequests.user', 'name avatar')
    .select('friendRequests');
  if (!user) {
    throw createError(404, 'User not found');
  }
  return (user.friendRequests as any[]).map((request) => ({
    _id: request.user._id,
    name: request.user.name,
    profilePhoto: request.user.profilePhoto,
    createdAt: request.createdAt,
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
  getUserProfileById,
  rejectFriendRequest,
  sendFriendRequest,
  unblockUser,
  unfriendUser,
  updateUserProfile,
};
