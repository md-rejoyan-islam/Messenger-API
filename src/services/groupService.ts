import createError from 'http-errors';
import { Types } from 'mongoose';
import Group from '../models/groupModel';
import User from '../models/userModel';
const createGroup = async (
  name: string,
  members: Types.ObjectId[],
  createdBy: Types.ObjectId,
) => {
  const users = await User.find({
    _id: { $in: members },
  });
  if (users.length !== members.length) {
    throw createError(404, 'One or more members do not exist');
  }

  const group = await Group.create({
    name,
    members: [...members, createdBy],
    admins: [createdBy],
    createdBy: createdBy,
  });

  return group;
};

const addGroupMember = async (
  groupId: Types.ObjectId,
  userId: Types.ObjectId,
) => {
  const user = await User.findById(userId);
  if (!user) {
    throw createError(404, 'User not found');
  }

  const group = await Group.findByIdAndUpdate(groupId, {
    $push: { members: userId },
  });
  if (!group) {
    throw createError(404, 'Group not found');
  }
};

const removeGroupMember = async (
  groupId: Types.ObjectId,
  userId: Types.ObjectId,
) => {
  const user = await User.findById(userId);
  if (!user) {
    throw createError(404, 'User not found');
  }

  const group = await Group.findByIdAndUpdate(groupId, {
    $pull: { members: userId },
  });

  if (!group) {
    throw createError(404, 'Group not found');
  }
};

export { addGroupMember, createGroup, removeGroupMember };
