import * as express from "express";
import {
  deleteMessageController,
  editMessageController,
  sendMessageController,
} from "../controllers/messageController";
import { protect } from "../middleware/authMiddleware";
import validate from "../middleware/validateMiddleware";
import {
  editDeleteMessageSchema,
  sendMessageSchema,
} from "../validations/messageValidation";

const router = express.Router();

router.use(protect);

router.post("/", validate(sendMessageSchema), sendMessageController);
router.put("/", validate(editDeleteMessageSchema), editMessageController);
router.delete("/", validate(editDeleteMessageSchema), deleteMessageController);

export { router as messageRoutes };
