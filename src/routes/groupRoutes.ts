import * as express from 'express';
import {
  addGroupMemberController,
  createGroupController,
  removeGroupMemberController,
} from '../controllers/groupController';
import { protect } from '../middleware/authMiddleware';
import validate from '../middleware/validateMiddleware';
import {
  addRemoveGroupMemberSchema,
  createGroupSchema,
} from '../validations/groupValidation';

const router = express.Router();

router.use(protect);

router.post('/', validate(createGroupSchema), createGroupController);
router.post(
  '/add-member',
  validate(addRemoveGroupMemberSchema),
  addGroupMemberController,
);
router.post(
  '/remove-member',
  validate(addRemoveGroupMemberSchema),
  removeGroupMemberController,
);

export { router as groupRoutes };
