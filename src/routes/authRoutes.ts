import * as express from 'express';
import {
  forgotPasswordController,
  loginUserController,
  logout,
  refreshTokenController,
  registerUserController,
  resetPasswordController,
} from '../controllers/authController';
import validate from '../middleware/validateMiddleware';
import {
  forgotPasswordSchema,
  loginUserSchema,
  refreshTokenSchema,
  registerUserSchema,
  resetPasswordSchema,
} from '../validations/userValidation';

const router = express.Router();

// register
router.post('/register', validate(registerUserSchema), registerUserController);

// login
router.post('/login', validate(loginUserSchema), loginUserController);

// forgot password
router.post(
  '/forgot-password',
  validate(forgotPasswordSchema),
  forgotPasswordController,
);

// reset password
router.put(
  '/reset-password/:token',
  validate(resetPasswordSchema),
  resetPasswordController,
);

// refresh token
router.post(
  '/refresh-token',
  validate(refreshTokenSchema),
  refreshTokenController,
);

// logout
router.post('/logout', logout);

export { router as authRoutes };
