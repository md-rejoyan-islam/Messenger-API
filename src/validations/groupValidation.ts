import z from "zod";
import { groupSchema } from "../schemas/groupSchemas";

export const createGroupSchema = z.object({
  body: groupSchema.pick({
    name: true,
    members: true,
  }),
});

const objectIdSchema = (field: string) =>
  z
    .string({
      required_error: `${field} is required`,
      invalid_type_error: `${field} must be a string`,
    })
    .regex(/^[0-9a-fA-F]{24}$/, {
      message: `Invalid ${field} format`,
    });

export const addRemoveGroupMemberSchema = z.object({
  groupId: objectIdSchema("groupId"),
  userId: objectIdSchema("userId"),
});
