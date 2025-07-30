import z from "zod";

const objectIdSchema = (field: string) =>
  z
    .string({
      required_error: `${field} is required`,
      invalid_type_error: `${field} must be a string`,
    })
    .regex(/^[0-9a-fA-F]{24}$/, {
      message: `Invalid ${field} format`,
    })
    .optional();

export const sendMessageSchema = z.object({
  body: z
    .object({
      recipient: objectIdSchema("recipient"),
      group: objectIdSchema("group"),
      content: z.string().min(1, "Message content cannot be empty").optional(),
      url: z.string().optional(),
      media: z.string().optional(),
    })
    .refine((data) => data.recipient || data.group, {
      message: "Either recipient or group must be provided",
      path: ["recipient", "group"],
    })
    .refine((data) => data.content || data.url || data.media, {
      message: "Message must contain content, a URL, or media",
      path: ["content", "url", "media"],
    }),
});

export const editDeleteMessageSchema = z.object({
  messageId: z
    .string({
      required_error: "Message ID is required",
      invalid_type_error: "Message ID must be a string",
    })
    .regex(/^[0-9a-fA-F]{24}$/, {
      message: "Invalid Message ID format",
    })
    .min(1, "Message ID is required"),
  content: z.string().min(1, "Message content cannot be empty").optional(),
  url: z.string().optional(),
  media: z.string().optional(),
}).refine((data) => data.content || data.url || data.media, {
  message: "Message must contain content, a URL, or media",
  path: ["content", "url", "media"],
});

export const getChatHistorySchema = z.object({
  params: z.object({
    userId: z.string().regex(/^[0-9a-fA-F]{24}$/, {
      message: "Invalid user ID format",
    }),
  }),
});
