import { Server, Socket } from 'socket.io';
import User from '../models/userModel';

interface MessagePayload {
  recipient?: string;
  group?: string;
  content: string;
  sender: string;
}

interface TypingPayload {
  recipient?: string;
  group?: string;
}

interface NotificationPayload {
  recipient: string;
  type:
    | 'friend_request'
    | 'friend_request_accepted'
    | 'friend_request_rejected'
    | 'friend_request_cancelled'
    | 'unfriend'
    | 'password_change'
    | 'profile_update';
  message: string;
}

const socketHandler = (io: Server): void => {
  const userSocketMap: { [userId: string]: string } = {};

  io.on('connection', (socket: Socket) => {
    const userId = socket.handshake.query.userId as string;
    if (userId) {
      userSocketMap[userId] = socket.id;
      User.findByIdAndUpdate(userId, { online: true }).catch(console.error);
      socket.join(userId);
    }

    socket.on('sendMessage', (message: MessagePayload) => {
      if (message.recipient) {
        io.to(message.recipient).emit('newMessage', message);
        io.to(message.recipient).emit('notification', {
          type: 'new_message',
          message: `You have a new message from ${message.sender}`,
        });
      } else if (message.group) {
        io.to(message.group).emit('newMessage', message);
        // You might want to fetch group members and emit to each
        io.to(message.group).emit('notification', {
          type: 'new_message',
          message: `You have a new message in ${message.group}`,
        });
      }
    });

    socket.on('typing', (payload: TypingPayload) => {
      if (payload.recipient) {
        io.to(payload.recipient).emit('typing', payload);
      } else if (payload.group) {
        socket.to(payload.group).emit('typing', payload);
      }
    });

    socket.on('notification', (payload: NotificationPayload) => {
      io.to(payload.recipient).emit('notification', payload);
    });

    socket.on('disconnect', () => {
      if (userId) {
        delete userSocketMap[userId];
        User.findByIdAndUpdate(userId, { online: false }).catch(console.error);
      }
    });
  });
};

export default socketHandler;
