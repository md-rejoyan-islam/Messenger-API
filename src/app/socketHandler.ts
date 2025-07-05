import { Server, Socket } from "socket.io";
import User from "../models/userModel";

interface MessagePayload {
  recipient?: string;
  group?: string;
  content: string;
}

const socketHandler = (io: Server): void => {
  io.on("connection", (socket: Socket) => {
    console.log("a user connected");

    socket.on("join", async (userId: string) => {
      await User.findByIdAndUpdate(userId, { online: true });
      socket.join(userId);
    });

    socket.on("sendMessage", (message: MessagePayload) => {
      if (message.recipient) {
        io.to(message.recipient).emit("newMessage", message);
      } else if (message.group) {
        // Emit to all members of the group
        // You might want to fetch group members and emit to each
        // For now, a placeholder
        io.to(message.group).emit("newMessage", message);
      }
    });

    socket.on("disconnect", async () => {
      // You might want to track connected users to set their status offline
      // For example, by storing userId in a map when they join
      console.log("user disconnected");
    });
  });
};

export default socketHandler;
