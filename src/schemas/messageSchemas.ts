import { z } from 'zod';

const objectIdSchema = z
  .string()
  .regex(/^[a-fA-F0-9]{24}$/, 'Invalid ObjectId');

export const messageSchema = z.object({
  sender: objectIdSchema,
  recipient: objectIdSchema.optional(),
  group: objectIdSchema.optional(),
  content: z.string().optional(),
  url: z.string().optional(),
  media: z.string().optional(),
  seen: z
    .boolean({
      invalid_type_error: 'Seen status must be a boolean',
    })
    .optional()
    .default(false),
});
