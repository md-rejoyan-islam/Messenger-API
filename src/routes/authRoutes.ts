import express from "express";
import {
  forgotPasswordController,
  loginUserController,
  registerUserController,
  resetPasswordController,
} from "../controllers/authController";
import validate from "../middleware/validateMiddleware";
import {
  forgotPasswordSchema,
  loginUserSchema,
  registerUserSchema,
  resetPasswordSchema,
} from "../validations/userValidation";

const router = express.Router();

// register
router.post("/register", validate(registerUserSchema), registerUserController);

// login
router.post("/login", validate(loginUserSchema), loginUserController);

// forgot password
router.post(
  "/forgot-password",
  validate(forgotPasswordSchema),
  forgotPasswordController
);

// reset password
router.put(
  "/reset-password/:token",
  validate(resetPasswordSchema),
  resetPasswordController
);

export { router as authRoutes };
