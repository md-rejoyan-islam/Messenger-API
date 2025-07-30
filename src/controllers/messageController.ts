import { Response } from 'express';
import { Types } from 'mongoose';
import {
  deleteMessage,
  editMessage,
  getChatHistory,
  getChats,
  sendMessage,
} from '../services/messageService';
import catchAsync from '../utils/catchAsync';
import { successResponse } from '../utils/responseHandler';
import { IUserRequest } from '../utils/types';

/**
 * @description Send a message
 * @method POST
 * @route /api/messages
 * @body {object} - Message details
 * @body {string} .recipient - Optional. User ID of the recipient (for direct messages)
 * @body {string} .group - Optional. Group ID (for group messages)
 * @body {string} .content - Required. Message content
 * @success-response 201 {object} { success: true, message: string, data: object } - Sent message data
 * @error-response 401 {object} { success: false, message: string, error: object } - Not authorized, token failed
 * @error-response 500 {object} { success: false, message: string, error: object } - Server error
 * @protected Yes
 */
const sendMessageController = catchAsync(
  async (req: IUserRequest, res: Response): Promise<void> => {
    const { recipient, group, content, url, media } = req.body;
    const { _id } = req.user!;

    const message = await sendMessage(
      _id,
      recipient,
      group,
      content,
      url,
      media,
    );
    successResponse(res, 'Message sent successfully', message, 201);
  },
);

/**
 * @description Edit a message
 * @method PUT
 * @route /api/messages
 * @body {object} - Message edit details
 * @body {string} .messageId - Required. ID of the message to edit
 * @body {string} .content - Required. New message content
 * @success-response 200 {object} { success: true, message: string } - Message edited
 * @error-response 401 {object} { success: false, message: string, error: object } - Not authorized, token failed
 * @error-response 500 {object} { success: false, message: string, error: object } - Server error
 * @protected Yes
 */
const editMessageController = catchAsync(
  async (req: IUserRequest, res: Response): Promise<void> => {
    const { messageId, content } = req.body;
    const { _id } = req.user!;

    await editMessage(messageId, content, _id);
    successResponse(res, 'Message edited successfully');
  },
);

/**
 * @description Delete a message
 * @method DELETE
 * @route /api/messages
 * @body {object} - Message delete details
 * @body {string} .messageId - Required. ID of the message to delete
 * @success-response 200 {object} { success: true, message: string } - Message deleted
 * @error-response 401 {object} { success: false, message: string, error: object } - Not authorized, token failed
 * @error-response 500 {object} { success: false, message: string, error: object } - Server error
 * @protected Yes
 */
const deleteMessageController = catchAsync(
  async (req: IUserRequest, res: Response): Promise<void> => {
    const { messageId } = req.body;
    const { _id } = req.user!;

    await deleteMessage(messageId, _id);
    successResponse(res, 'Message deleted successfully');
  },
);

/**
 * @description Get all chats for the authenticated user
 * @method GET
 * @route /api/messages/chats
 * @success-response 200 {object[]} chats - List of chats with last message and user details
 * @error-response 401 {string} message - Not authorized, token failed
 * @error-response 500 {string} message - Server error
 * @protected Yes
 */

const getChatsController = catchAsync(
  async (req: IUserRequest, res: Response): Promise<void> => {
    const { _id } = req.user!;
    const chats = await getChats(_id);
    successResponse(res, 'Chats retrieved successfully', chats);
  },
);

/**
 * @description Get chat history with a specific user
 * @method GET
 * @route /api/messages/:userId
 * @param {string} userId - ID of the user to get chat history with
 * @success-response 200 {object[]} messages - List of messages
 * @error-response 401 {string} message - Not authorized, token failed
 * @error-response 500 {string} message - Server error
 * @protected Yes
 */

const getChatHistoryController = catchAsync(
  async (req: IUserRequest, res: Response): Promise<void> => {
    const { _id } = req.user!;
    const { userId } = req.params;
    const messages = await getChatHistory(_id, new Types.ObjectId(userId));
    successResponse(res, 'Chat history retrieved successfully', messages);
  },
);

export {
  deleteMessageController,
  editMessageController,
  getChatHistoryController,
  getChatsController,
  sendMessageController,
};
