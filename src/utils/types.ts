import { Request } from 'express';
import { Document, Types } from 'mongoose';

export interface IUserRequest extends Request {
  user?: {
    _id: Types.ObjectId;
    name: string;
    email: string;
  } & Document;
}
