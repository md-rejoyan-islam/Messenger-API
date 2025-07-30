import * as bcrypt from 'bcryptjs';
import mongoose, { Document, Schema } from 'mongoose';

interface IUser extends Document {
  _id: Schema.Types.ObjectId;
  name: string;
  email: string;
  password?: string;
  avatar: string;
  friends: Schema.Types.ObjectId[];
  friendRequests: {
    user: Schema.Types.ObjectId;
    createdAt: Date;
  }[];
  sentFriendRequests: {
    user: Schema.Types.ObjectId;
    createdAt: Date;
  }[];
  blockedUsers: Schema.Types.ObjectId[];
  online: boolean;
  lastSeen?: Date;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
  bio?: string;
  matchPassword(enteredPassword: string): Promise<boolean>;
}

const userSchema = new mongoose.Schema<IUser>({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  avatar: {
    type: String,
    default: null,
  },
  bio: {
    type: String,
    default: null,
  },
  friends: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  ],
  friendRequests: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  sentFriendRequests: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  blockedUsers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  ],
  online: {
    type: Boolean,
    default: false,
  },
  lastSeen: {
    type: Date,
    default: Date.now,
  },
  resetPasswordToken: String,
  resetPasswordExpires: Date,
});

userSchema.pre<IUser>('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password!, salt);
});

userSchema.methods.matchPassword = async function (
  enteredPassword: string,
): Promise<boolean> {
  console.log(this.password);
  console.log(enteredPassword);

  console.log(await bcrypt.compare(enteredPassword, this.password!));

  return await bcrypt.compare(enteredPassword, this.password!);
};

const User = mongoose.model<IUser>('User', userSchema);

export default User;
