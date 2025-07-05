import { z } from "zod";
import { userSchema } from "../schemas/userSchema";

export const registerUserSchema = z.object({
  body: userSchema.pick({
    name: true,
    email: true,
    password: true,
  }),
});

export const loginUserSchema = z.object({
  body: userSchema.pick({
    email: true,
    password: true,
  }),
});

export const forgotPasswordSchema = z.object({
  body: userSchema.pick({
    email: true,
  }),
});

export const resetPasswordSchema = z.object({
  body: userSchema.pick({
    password: true,
  }),
});

const objectIdSchema = z
  .string({
    required_error: "ObjectId is required",
    invalid_type_error: "ObjectId must be a string",
  })
  .regex(/^[0-9a-fA-F]{24}$/, {
    message: "Invalid ObjectId format",
  });

export const friendRequestSchema = z.object({
  body: z.object({
    userId: objectIdSchema,
  }),
});

export const updateUserProfileSchema = z.object({
  body: z.object({
    name: z
      .string({
        required_error: "Name is required",
        invalid_type_error: "Name must be a string",
      })
      .optional(),
    profilePhoto: z.string().url("Invalid URL format").optional(),
    bio: z
      .string({
        invalid_type_error: "Bio must be a string",
      })
      .optional(),
  }),
});

export const changePasswordSchema = z.object({
  body: z.object({
    oldPassword: z
      .string({
        required_error: "Old password is required",
        invalid_type_error: "Old password must be a string",
      })
      .min(1, "Old password is required"),
    newPassword: z
      .string({
        required_error: "New password is required",
        invalid_type_error: "New password must be a string",
      })
      .min(6, "New password must be at least 6 characters long"),
  }),
});
