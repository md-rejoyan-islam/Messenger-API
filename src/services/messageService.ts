import createError from "http-errors";
import { Types } from "mongoose";
import Message from "../models/messageModel";
import User from "../models/userModel";

const sendMessage = async (
  sender: Types.ObjectId,
  recipient: Types.ObjectId | undefined,
  group: Types.ObjectId | undefined,
  content: string
) => {
  const existRecipient = await User.findById(recipient);
  const existGroup = await User.find({ _id: group });
  if (!existRecipient && !existGroup) {
    throw createError(404, "Recipient or group id not found");
  }

  const message = await Message.create({
    sender,
    recipient,
    group,
    content,
  });
  return message;
};

const editMessage = async (messageId: Types.ObjectId, content: string) => {
  const message = await Message.findByIdAndUpdate(messageId, { content });
  if (!message) {
    throw createError(404, "Message not found");
  }
};

const deleteMessage = async (messageId: Types.ObjectId) => {
  const message = await Message.findByIdAndDelete(messageId);
  if (!message) {
    throw createError(404, "Message not found");
  }
};

export { deleteMessage, editMessage, sendMessage };
