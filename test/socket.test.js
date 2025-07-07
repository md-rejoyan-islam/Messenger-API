"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const socket_io_1 = require("socket.io");
const http_1 = require("http");
const socket_io_client_1 = require("socket.io-client");
const socketHandler_1 = __importDefault(require("../src/app/socketHandler"));
const userModel_1 = __importDefault(require("../src/models/userModel"));
const mongoose_1 = __importDefault(require("mongoose"));
const waitFor = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
(0, vitest_1.describe)("Socket.io Handler", () => {
    let io, clientSocket, serverSocket;
    let user;
    (0, vitest_1.beforeAll)(async () => {
        const httpServer = (0, http_1.createServer)();
        io = new socket_io_1.Server(httpServer);
        (0, socketHandler_1.default)(io);
        httpServer.listen();
        await mongoose_1.default.connect(process.env.MONGO_URI || "");
        user = await userModel_1.default.create({
            name: "Test User",
            email: "test@example.com",
            password: "password",
        });
        const port = httpServer.address().port;
        clientSocket = (0, socket_io_client_1.io)(`http://localhost:${port}`, {
            query: { userId: user._id.toString() },
        });
        clientSocket.emit("join", user._id.toString());
        await new Promise((resolve) => {
            io.on("connection", (socket) => {
                serverSocket = socket;
                resolve();
            });
        });
    });
    (0, vitest_1.afterAll)(async () => {
        await userModel_1.default.findByIdAndDelete(user._id);
        await mongoose_1.default.connection.close();
        io.close();
        clientSocket.close();
    });
    (0, vitest_1.it)("should handle user connection", async () => {
        await waitFor(100);
        const connectedUser = await userModel_1.default.findById(user._id);
        (0, vitest_1.expect)(connectedUser?.online).toBe(true);
    });
    (0, vitest_1.it)("should handle typing indicators", async () => {
        const payload = {
            recipient: user._id.toString(),
        };
        let receivedPayload;
        clientSocket.on("typing", (p) => {
            receivedPayload = p;
        });
        serverSocket.emit("typing", payload);
        await waitFor(100);
        (0, vitest_1.expect)(receivedPayload).toEqual(payload);
    });
});
