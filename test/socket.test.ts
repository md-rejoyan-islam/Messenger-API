import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { Server } from "socket.io";
import { createServer } from "http";
import { io as ioc, Socket as ClientSocket } from "socket.io-client";
import socketHandler from "../src/app/socketHandler";
import User from "../src/models/userModel";
import mongoose from "mongoose";

const waitFor = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

describe("Socket.io Handler", () => {
  let io: Server, clientSocket: ClientSocket, serverSocket: any;
  let user: any;

  beforeAll(async () => {
    const httpServer = createServer();
    io = new Server(httpServer);
    socketHandler(io);
    httpServer.listen();

    await mongoose.connect(process.env.MONGO_URI || "");

    user = await User.create({
      name: "Test User",
      email: "test@example.com",
      password: "password",
    });

    const port = (httpServer.address() as any).port;
    clientSocket = ioc(`http://localhost:${port}`, {
      query: { userId: user._id.toString() },
    });

    clientSocket.emit("join", user._id.toString());

    await new Promise<void>((resolve) => {
      io.on("connection", (socket) => {
        serverSocket = socket;
        resolve();
      });
    });
  });

  afterAll(async () => {
    await User.findByIdAndDelete(user._id);
    await mongoose.connection.close();
    io.close();
    clientSocket.close();
  });

  it("should handle user connection", async () => {
    await waitFor(100);
    const connectedUser = await User.findById(user._id);
    expect(connectedUser?.online).toBe(true);
  });

  it("should handle typing indicators", async () => {
    const payload = {
      recipient: user._id.toString(),
    };

    let receivedPayload: any;
    clientSocket.on("typing", (p) => {
      receivedPayload = p;
    });

    serverSocket.emit("typing", payload);

    await waitFor(100);

    expect(receivedPayload).toEqual(payload);
  });
});