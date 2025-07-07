"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const app_1 = __importDefault(require("../src/app/app"));
const messageModel_1 = __importDefault(require("../src/models/messageModel"));
const userModel_1 = __importDefault(require("../src/models/userModel"));
describe("Message API", () => {
    let authToken;
    let testUser;
    let otherUser;
    beforeEach(async () => {
        await userModel_1.default.deleteMany({});
        await messageModel_1.default.deleteMany({});
        const registerRes = await (0, supertest_1.default)(app_1.default)
            .post("/api/v1/auth/register")
            .send({
            name: "Test User",
            email: `test_user_${Date.now()}@example.com`,
            password: "password123",
        });
        expect(registerRes.statusCode).toEqual(201);
        expect(registerRes.body.success).toBe(true);
        authToken = registerRes.body.data.token;
        testUser = registerRes.body.data;
        const otherUserRes = await (0, supertest_1.default)(app_1.default)
            .post("/api/v1/auth/register")
            .send({
            name: "Other User",
            email: `other_user_${Date.now()}@example.com`,
            password: "password123",
        });
        expect(otherUserRes.statusCode).toEqual(201);
        expect(otherUserRes.body.success).toBe(true);
        otherUser = otherUserRes.body.data;
    });
    it("should send a message to a recipient", async () => {
        const res = await (0, supertest_1.default)(app_1.default)
            .post("/api/v1/messages")
            .set("Authorization", `Bearer ${authToken}`)
            .send({
            recipient: otherUser._id,
            content: "Hello, other user!",
        });
        expect(res.statusCode).toEqual(201);
        expect(res.body.success).toBe(true);
        expect(res.body.data).toHaveProperty("_id");
        expect(res.body.data.content).toEqual("Hello, other user!");
        expect(res.body.data.sender).toEqual(testUser._id);
        expect(res.body.data.recipient).toEqual(otherUser._id);
    });
    it("should edit a message", async () => {
        const sendRes = await (0, supertest_1.default)(app_1.default)
            .post("/api/v1/messages")
            .set("Authorization", `Bearer ${authToken}`)
            .send({
            recipient: otherUser._id,
            content: "Original message",
        });
        const messageId = sendRes.body.data._id;
        const res = await (0, supertest_1.default)(app_1.default)
            .put("/api/v1/messages")
            .set("Authorization", `Bearer ${authToken}`)
            .send({
            messageId,
            content: "Edited message",
        });
        expect(res.statusCode).toEqual(200);
        expect(res.body.success).toBe(true);
        expect(res.body.message).toEqual("Message edited");
        const updatedMessage = await messageModel_1.default.findById(messageId);
        expect(updatedMessage?.content).toEqual("Edited message");
    });
    it("should delete a message", async () => {
        const sendRes = await (0, supertest_1.default)(app_1.default)
            .post("/api/v1/messages")
            .set("Authorization", `Bearer ${authToken}`)
            .send({
            recipient: otherUser._id,
            content: "Message to delete",
        });
        const messageId = sendRes.body.data._id;
        const res = await (0, supertest_1.default)(app_1.default)
            .delete("/api/v1/messages")
            .set("Authorization", `Bearer ${authToken}`)
            .send({
            messageId,
        });
        expect(res.statusCode).toEqual(200);
        expect(res.body.success).toBe(true);
        expect(res.body.message).toEqual("Message deleted");
        const deletedMessage = await messageModel_1.default.findById(messageId);
        expect(deletedMessage).toBeNull();
    });
});
