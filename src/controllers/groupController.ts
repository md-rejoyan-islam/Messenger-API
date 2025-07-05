import { Request, Response } from "express";

import {
  addGroupMember,
  createGroup,
  removeGroupMember,
} from "../services/groupService";
import catchAsync from "../utils/catchAsync";
import { successResponse } from "../utils/responseHandler";
import { IUserRequest } from "../utils/types";

/**
 * @description Create a new group
 * @method POST
 * @route /api/groups
 * @body {object} - Group creation details
 * @body {string} .name - Required. Name of the group
 * @body {Array<string>} .members - Optional. Array of user IDs to be added as members
 * @success-response 201 {object} { success: true, message: string, data: object } - Created group data
 * @error-response 401 {object} { success: false, message: string, error: object } - Not authorized, token failed
 * @error-response 500 {object} { success: false, message: string, error: object } - Server error
 * @protected Yes
 */
const createGroupController = catchAsync(
  async (req: IUserRequest, res: Response): Promise<void> => {
    const { name, members } = req.body;
    const { _id } = req.user!;

    const group = await createGroup(name, members, _id);
    successResponse(res, "Group created successfully", group, 201);
  }
);

/**
 * @description Add a member to a group
 * @method POST
 * @route /api/groups/add-member
 * @body {object} - Add member details
 * @body {string} .groupId - Required. ID of the group
 * @body {string} .userId - Required. ID of the user to add
 * @success-response 200 {object} { success: true, message: string } - Member added
 * @error-response 401 {object} { success: false, message: string, error: object } - Not authorized, token failed
 * @error-response 500 {object} { success: false, message: string, error: object } - Server error
 * @protected Yes
 */
const addGroupMemberController = catchAsync(
  async (req: Request, res: Response): Promise<void> => {
    const { groupId, userId } = req.body;

    await addGroupMember(groupId, userId);
    successResponse(res, "Member added successfully");
  }
);

/**
 * @description Remove a member from a group
 * @method POST
 * @route /api/groups/remove-member
 * @body {object} - Remove member details
 * @body {string} .groupId - Required. ID of the group
 * @body {string} .userId - Required. ID of the user to remove
 * @success-response 200 {object} { success: true, message: string } - Member removed
 * @error-response 401 {object} { success: false, message: string, error: object } - Not authorized, token failed
 * @error-response 500 {object} { success: false, message: string, error: object } - Server error
 * @protected Yes
 */
const removeGroupMemberController = catchAsync(
  async (req: Request, res: Response): Promise<void> => {
    const { groupId, userId } = req.body;

    await removeGroupMember(groupId, userId);
    successResponse(res, "Member removed successfully");
  }
);

export {
  addGroupMemberController,
  createGroupController,
  removeGroupMemberController,
};
