import createError from 'http-errors';
import { Types } from 'mongoose';
import Message from '../models/messageModel';
import User from '../models/userModel';

const sendMessage = async (
  sender: Types.ObjectId,
  recipient: Types.ObjectId | undefined,
  group: Types.ObjectId | undefined,
  content: string,
  url?: string,
  media?: string,
) => {
  const existRecipient = await User.findById(recipient);
  const existGroup = await User.find({ _id: group });
  if (!existRecipient && !existGroup) {
    throw createError(404, 'Recipient or group id not found');
  }

  const message = await Message.create({
    sender,
    recipient,
    group,
    content,
    url,
    media,
  });
  return message;
};

const editMessage = async (
  messageId: Types.ObjectId,
  content: string,
  userId: Types.ObjectId,
) => {
  const message = await Message.findById(messageId);

  if (!message) {
    throw createError(404, 'Message not found');
  }

  if (message.sender.toString() !== userId.toString()) {
    throw createError(401, 'You are not authorized to edit this message');
  }

  message.content = content;
  await message.save();
};

const deleteMessage = async (
  messageId: Types.ObjectId,
  userId: Types.ObjectId,
) => {
  const message = await Message.findById(messageId);

  if (!message) {
    throw createError(404, 'Message not found');
  }

  if (message.sender.toString() !== userId.toString()) {
    throw createError(401, 'You are not authorized to delete this message');
  }

  await message.deleteOne();
};

const getChats = async (userId: Types.ObjectId) => {
  const chats = await Message.aggregate([
    {
      $match: {
        $or: [{ sender: userId }, { recipient: userId }],
      },
    },
    {
      $sort: { createdAt: -1 },
    },
    {
      $group: {
        _id: {
          $cond: {
            if: { $eq: ['$sender', userId] },
            then: '$recipient',
            else: '$sender',
          },
        },
        lastMessage: {
          $first: '$content',
        },
        unReadCount: {
          $sum: {
            $cond: [{ $eq: ['$seen', false] }, 1, 0],
          },
        },
      },
    },
    {
      $lookup: {
        from: 'users',
        localField: '_id',
        foreignField: '_id',
        as: 'user',
      },
    },
    {
      $lookup: {
        from: 'groups',
        localField: '_id',
        foreignField: '_id',
        as: 'group',
      },
    },
    {
      $unwind: {
        path: '$user',
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $unwind: {
        path: '$group',
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $project: {
        _id: 1,
        lastMessage: 1,
        unReadCount: 1,
        user: {
          _id: '$user._id',
          name: '$user.name',
          avatar: '$user.avatar',
          online: '$user.online',
          lastSeen: '$user.lastSeen',
        },
        group: {
          _id: '$group._id',
          name: '$group.name',
        },
        isGroup: { $cond: { if: '$group', then: true, else: false } },
      },
    },
  ]);

  return chats;
};

const getChatHistory = async (
  userId: Types.ObjectId,
  recipientId: Types.ObjectId,
) => {
  const existRecipient = await User.findById(recipientId).select(
    '_id name avatar online lastSeen',
  );
  if (!existRecipient) {
    throw createError(404, 'Recipient not found');
  }

  const messages = await Message.aggregate([
    {
      $match: {
        $or: [
          { sender: userId, recipient: recipientId },
          { sender: recipientId, recipient: userId },
        ],
      },
    },
    {
      $sort: { createdAt: 1 },
    },
    {
      $addFields: {
        isSent: { $eq: ['$sender', userId] },
      },
    },
  ]);

  return {
    ...existRecipient.toObject(),
    messages: messages,
  };
};

export { deleteMessage, editMessage, getChatHistory, getChats, sendMessage };
