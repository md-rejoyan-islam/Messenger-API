import { z } from "zod";

const objectIdSchema = z
  .string()
  .regex(/^[a-fA-F0-9]{24}$/, "Invalid ObjectId");

export const messageSchema = z.object({
  sender: objectIdSchema,
  recipient: objectIdSchema.optional(),
  group: objectIdSchema.optional(),
  content: z
    .string({
      required_error: "Message content is required",
      invalid_type_error: "Message content must be a string",
    })
    .min(1, "Message content is required"),
  seen: z
    .boolean({
      invalid_type_error: "Seen status must be a boolean",
    })
    .optional()
    .default(false),
});
