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

export const sendMessageSchema = z
  .object({
    recipient: objectIdSchema("recipient"),
    group: objectIdSchema("group"),
    content: z.string().min(1, "Message content cannot be empty"),
  })
  .refine((data) => data.recipient || data.group, {
    message: "Either recipient or group must be provided",
    path: ["recipient", "group"],
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
  content: z.string().min(1, "Message content cannot be empty").optional(), // Content is optional for delete
});
