import { z } from "zod";

const objectIdSchema = z.string().regex(/^[0-9a-fA-F]{24}$/, {
  message: "Invalid ObjectId",
});

export const userSchema = z.object({
  name: z
    .string({
      required_error: "Name is required",
      invalid_type_error: "Name must be a string",
    })
    .min(1, "Name must be at least 1 character"),
  email: z
    .string({
      required_error: "Email is required",
      invalid_type_error: "Email must be a string",
    })
    .email("Invalid email address"),
  password: z
    .string({
      required_error: "Password is required",
      invalid_type_error: "Password must be a string",
    })
    .min(6, "Password must be at least 6 characters"),

  profilePhoto: z
    .string({
      invalid_type_error: "Profile photo must be a string",
    })
    .optional()
    .default(""),
  bio: z
    .string({
      invalid_type_error: "Bio must be a string",
    })
    .optional(),
  friends: z.array(objectIdSchema).optional().default([]),
  friendRequests: z.array(objectIdSchema).optional().default([]),
  sentFriendRequests: z.array(objectIdSchema).optional().default([]),
  blockedUsers: z.array(objectIdSchema).optional().default([]),

  online: z
    .boolean({
      invalid_type_error: "Online status must be a boolean",
    })
    .optional()
    .default(false),

  resetPasswordToken: z
    .string({
      invalid_type_error: "Reset password token must be a string",
    })
    .optional()
    .nullable(),
  resetPasswordExpires: z.coerce.date().optional().nullable(),
});

export type IUser = z.infer<typeof userSchema>;
