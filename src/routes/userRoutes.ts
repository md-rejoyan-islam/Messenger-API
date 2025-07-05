import express from "express";
import {
  acceptFriendRequestController,
  blockUserController,
  cancelFriendRequestController,
  changePasswordController,
  rejectFriendRequestController,
  sendFriendRequestController,
  unblockUserController,
  unfriendUserController,
  updateUserProfileController,
} from "../controllers/userController";

import { protect } from "../middleware/authMiddleware";
import validate from "../middleware/validateMiddleware";
import {
  changePasswordSchema,
  friendRequestSchema,
  updateUserProfileSchema,
} from "../validations/userValidation";

const router = express.Router();

router.use(protect);

// update profile
router.put(
  "/profile",
  validate(updateUserProfileSchema),
  updateUserProfileController
);

// change password
router.put(
  "/change-password",
  protect,
  validate(changePasswordSchema),
  changePasswordController
);

// friend requests
router.post(
  "/friend-request",
  validate(friendRequestSchema),
  sendFriendRequestController
);

// accept friend request
router.post(
  "/friend-request/accept",
  validate(friendRequestSchema),
  acceptFriendRequestController
);

// reject friend request
router.post(
  "/friend-request/reject",
  validate(friendRequestSchema),
  rejectFriendRequestController
);

// cancel friend request
router.post(
  "/friend-request/cancel",
  validate(friendRequestSchema),
  cancelFriendRequestController
);

// unfriend user
router.post("/unfriend", validate(friendRequestSchema), unfriendUserController);

// block user
router.post("/block", validate(friendRequestSchema), blockUserController);

// unblock user
router.post("/unblock", validate(friendRequestSchema), unblockUserController);

export { router as userRoutes };
