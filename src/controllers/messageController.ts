import { Request, Response } from "express";

import {
  deleteMessage,
  editMessage,
  sendMessage,
} from "../services/messageService";
import catchAsync from "../utils/catchAsync";
import { successResponse } from "../utils/responseHandler";
import { IUserRequest } from "../utils/types";

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
    const { recipient, group, content } = req.body;
    const { _id } = req.user!;

    const message = await sendMessage(_id, recipient, group, content);
    successResponse(res, "Message sent successfully", message, 201);
  }
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
  async (req: Request, res: Response): Promise<void> => {
    const { messageId, content } = req.body;

    await editMessage(messageId, content);
    successResponse(res, "Message edited successfully");
  }
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
  async (req: Request, res: Response): Promise<void> => {
    const { messageId } = req.body;

    await deleteMessage(messageId);
    successResponse(res, "Message deleted successfully");
  }
);

export {
  deleteMessageController,
  editMessageController,
  sendMessageController,
};
