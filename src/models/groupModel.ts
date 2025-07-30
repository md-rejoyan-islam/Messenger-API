import mongoose, { Document, Schema } from 'mongoose';

interface IGroup extends Document {
  name: string;
  members: Schema.Types.ObjectId[];
  admins: Schema.Types.ObjectId[];
  createdBy: Schema.Types.ObjectId;
}

const groupSchema = new mongoose.Schema<IGroup>({
  name: {
    type: String,
    required: true,
  },
  members: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  ],
  admins: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  ],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
});

const Group = mongoose.model<IGroup>('Group', groupSchema);

export default Group;
