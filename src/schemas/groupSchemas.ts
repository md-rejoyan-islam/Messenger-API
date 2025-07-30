import { z } from 'zod';

const objectId = z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid ObjectId');

export const groupSchema = z.object({
  name: z
    .string({
      required_error: 'Group name is required',
      invalid_type_error: 'Group name must be a string',
    })
    .min(1, 'Group name is required'),

  members: z.array(objectId).optional().default([]),

  admins: z.array(objectId).optional().default([]),

  createdBy: objectId.optional(),
});
