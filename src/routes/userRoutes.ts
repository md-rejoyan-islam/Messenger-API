import * as express from "express";
import {
  acceptFriendRequestController,
  blockUserController,
  cancelFriendRequestController,
  changePasswordController,
  findFriendsController,
  getAllFriendsController,
  getAllSentRequestsController,
  getFriendRequestController,
  getUserByIdController,
  getUserProfileController,
  rejectFriendRequestController,
  sendFriendRequestController,
  unblockUserController,
  unfriendUserController,
  updateUserProfileController,
} from "../controllers/userController";

import { protect } from "../middleware/authMiddleware";
import validate from "../middleware/validateMiddleware";
import { uploadSingleImage } from "../utils/multer";
import {
  changePasswordSchema,
  friendRequestSchema,
} from "../validations/userValidation";

const router = express.Router();

router.use(protect);

// get profile
router.get("/profile", getUserProfileController);
// update profile
router.put(
  "/profile",
  // validate(updateUserProfileSchema),
  uploadSingleImage,
  updateUserProfileController
);

// change password
router.put(
  "/change-password",
  protect,
  validate(changePasswordSchema),
  changePasswordController
);

// get all friend
router.get("/friends", getAllFriendsController);

// friend requests
router.get("/friend-requests", getFriendRequestController);

// get all sending friend requests
router.get("/sent-requests", getAllSentRequestsController);

// find friends
router.get("/find-friends", findFriendsController);

// send friend request
router.post(
  "/friend-requests/:id",
  validate(friendRequestSchema),
  sendFriendRequestController
);

// accept friend request
router.post(
  "/friend-requests/:id/accept",
  validate(friendRequestSchema),
  acceptFriendRequestController
);

// reject friend request
router.post(
  "/friend-requests/:id/reject",
  validate(friendRequestSchema),
  rejectFriendRequestController
);

// cancel friend request
router.post(
  "/friend-requests/:id/cancel",
  validate(friendRequestSchema),
  cancelFriendRequestController
);

// unfriend user
router.post(
  "/:id/unfriend",
  validate(friendRequestSchema),
  unfriendUserController
);

// block friend
router.post("/:id/block", validate(friendRequestSchema), blockUserController);

// unblock friend
router.post(
  "/:id/unblock",
  validate(friendRequestSchema),
  unblockUserController
);

// get user profile by id
router.get("/:id", getUserByIdController);

export { router as userRoutes };
