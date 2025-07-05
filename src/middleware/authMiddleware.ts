import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/userModel';
import { Document, Types } from 'mongoose';

interface DecodedToken {
    id: Types.ObjectId;
}

interface IUserRequest extends Request {
    user?: {
        _id: Types.ObjectId;
        name: string;
        email: string;
    } & Document;
}

const protect = async (req: IUserRequest, res: Response, next: NextFunction): Promise<void> => {
    let token: string | undefined;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as DecodedToken;
            req.user = await User.findById(decoded.id).select('-password');
            next();
        } catch (error: any) {
            console.error(error);
            res.status(401).json({ message: 'Not authorized, token failed' });
        }
    }

    if (!token) {
        res.status(401).json({ message: 'Not authorized, no token' });
    }
};

export { protect };