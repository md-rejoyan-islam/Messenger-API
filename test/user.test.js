"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const app_1 = __importDefault(require("../src/app/app"));
const userModel_1 = __importDefault(require("../src/models/userModel"));
const mongoose_1 = require("mongoose");
describe('User API', () => {
    let authToken;
    let testUser;
    let otherUser;
    beforeEach(async () => {
        await userModel_1.default.deleteMany({}); // Clear the database before each test
        // Register a test user
        const registerRes = await (0, supertest_1.default)(app_1.default)
            .post('/api/v1/auth/register')
            .send({
            name: 'Test User',
            email: `test_user_${Date.now()}@example.com`,
            password: 'password123',
        });
        expect(registerRes.statusCode).toEqual(201);
        expect(registerRes.body.success).toBe(true);
        authToken = registerRes.body.data.token;
        testUser = registerRes.body.data;
        // Register another user
        const otherUserRes = await (0, supertest_1.default)(app_1.default)
            .post('/api/v1/auth/register')
            .send({
            name: 'Other User',
            email: `other_user_${Date.now()}@example.com`,
            password: 'password123',
        });
        expect(otherUserRes.statusCode).toEqual(201);
        expect(otherUserRes.body.success).toBe(true);
        otherUser = otherUserRes.body.data;
    });
    it('should register a new user', async () => {
        const res = await (0, supertest_1.default)(app_1.default)
            .post('/api/v1/auth/register')
            .send({
            name: 'New User',
            email: 'new@example.com',
            password: 'newpassword123',
        });
        expect(res.statusCode).toEqual(201);
        expect(res.body.success).toBe(true);
        expect(res.body.data).toHaveProperty('token');
    });
    it('should not register a user with existing email', async () => {
        // Register a user first
        await (0, supertest_1.default)(app_1.default)
            .post('/api/v1/auth/register')
            .send({
            name: 'Existing User',
            email: 'existing@example.com',
            password: 'password123',
        });
        const res = await (0, supertest_1.default)(app_1.default)
            .post('/api/v1/auth/register')
            .send({
            name: 'Another User',
            email: 'existing@example.com',
            password: 'password456',
        });
        expect(res.statusCode).toEqual(400);
        expect(res.body.success).toBe(false);
        expect(res.body.message).toEqual('User with that email already exists');
    });
    it('should login an existing user', async () => {
        const res = await (0, supertest_1.default)(app_1.default)
            .post('/api/v1/auth/login')
            .send({
            email: testUser.email,
            password: 'password123',
        });
        expect(res.statusCode).toEqual(200);
        expect(res.body.success).toBe(true);
        expect(res.body.data).toHaveProperty('token');
    });
    it('should not login with invalid credentials', async () => {
        const res = await (0, supertest_1.default)(app_1.default)
            .post('/api/v1/auth/login')
            .send({
            email: 'test@example.com',
            password: 'wrongpassword',
        });
        expect(res.statusCode).toEqual(401);
        expect(res.body.success).toBe(false);
        expect(res.body.message).toEqual('Invalid email or password');
    });
    it('should send a friend request', async () => {
        const res = await (0, supertest_1.default)(app_1.default)
            .post('/api/v1/users/friend-request')
            .set('Authorization', `Bearer ${authToken}`)
            .send({
            userId: otherUser._id,
        });
        expect(res.statusCode).toEqual(200);
        expect(res.body.success).toBe(true);
        expect(res.body.message).toEqual('Friend request sent');
        const updatedOtherUser = await userModel_1.default.findById(otherUser._id);
        expect(updatedOtherUser?.friendRequests).toContainEqual(new mongoose_1.Types.ObjectId(testUser._id));
    });
    it('should accept a friend request', async () => {
        // Send request first
        await (0, supertest_1.default)(app_1.default)
            .post('/api/v1/users/friend-request')
            .set('Authorization', `Bearer ${authToken}`)
            .send({
            userId: otherUser._id,
        });
        // Accept request from other user's perspective
        const otherUserLoginRes = await (0, supertest_1.default)(app_1.default)
            .post('/api/v1/auth/login')
            .send({
            email: otherUser.email,
            password: 'password123',
        });
        const otherUserAuthToken = otherUserLoginRes.body.data.token;
        const res = await (0, supertest_1.default)(app_1.default)
            .post('/api/v1/users/friend-request/accept')
            .set('Authorization', `Bearer ${otherUserAuthToken}`)
            .send({
            userId: testUser._id,
        });
        expect(res.statusCode).toEqual(200);
        expect(res.body.success).toBe(true);
        expect(res.body.message).toEqual('Friend request accepted');
        const updatedTestUser = await userModel_1.default.findById(testUser._id);
        const updatedOtherUser = await userModel_1.default.findById(otherUser._id);
        expect(updatedTestUser?.friends).toContainEqual(new mongoose_1.Types.ObjectId(otherUser._id));
        expect(updatedOtherUser?.friends).toContainEqual(new mongoose_1.Types.ObjectId(testUser._id));
        expect(updatedTestUser?.sentFriendRequests).not.toContainEqual(new mongoose_1.Types.ObjectId(otherUser._id));
        expect(updatedOtherUser?.friendRequests).not.toContainEqual(new mongoose_1.Types.ObjectId(testUser._id));
    });
    it('should reject a friend request', async () => {
        // Send request first
        await (0, supertest_1.default)(app_1.default)
            .post('/api/v1/users/friend-request')
            .set('Authorization', `Bearer ${authToken}`)
            .send({
            userId: otherUser._id,
        });
        // Reject request from other user's perspective
        const otherUserLoginRes = await (0, supertest_1.default)(app_1.default)
            .post('/api/v1/auth/login')
            .send({
            email: otherUser.email,
            password: 'password123',
        });
        const otherUserAuthToken = otherUserLoginRes.body.data.token;
        const res = await (0, supertest_1.default)(app_1.default)
            .post('/api/v1/users/friend-request/reject')
            .set('Authorization', `Bearer ${otherUserAuthToken}`)
            .send({
            userId: testUser._id,
        });
        expect(res.statusCode).toEqual(200);
        expect(res.body.success).toBe(true);
        expect(res.body.message).toEqual('Friend request rejected');
        const updatedTestUser = await userModel_1.default.findById(testUser._id);
        const updatedOtherUser = await userModel_1.default.findById(otherUser._id);
        expect(updatedTestUser?.sentFriendRequests).not.toContainEqual(new mongoose_1.Types.ObjectId(otherUser._id));
        expect(updatedOtherUser?.friendRequests).not.toContainEqual(new mongoose_1.Types.ObjectId(testUser._id));
    });
    it('should cancel a sent friend request', async () => {
        // Send request first
        await (0, supertest_1.default)(app_1.default)
            .post('/api/v1/users/friend-request')
            .set('Authorization', `Bearer ${authToken}`)
            .send({
            userId: otherUser._id,
        });
        // Cancel request
        const res = await (0, supertest_1.default)(app_1.default)
            .post('/api/v1/users/friend-request/cancel')
            .set('Authorization', `Bearer ${authToken}`)
            .send({
            userId: otherUser._id,
        });
        expect(res.statusCode).toEqual(200);
        expect(res.body.success).toBe(true);
        expect(res.body.message).toEqual('Friend request cancelled');
        const updatedTestUser = await userModel_1.default.findById(testUser._id);
        const updatedOtherUser = await userModel_1.default.findById(otherUser._id);
        expect(updatedTestUser?.sentFriendRequests).not.toContainEqual(new mongoose_1.Types.ObjectId(otherUser._id));
        expect(updatedOtherUser?.friendRequests).not.toContainEqual(new mongoose_1.Types.ObjectId(testUser._id));
    });
    it('should unfriend a user', async () => {
        // Make them friends first
        await (0, supertest_1.default)(app_1.default)
            .post('/api/v1/users/friend-request')
            .set('Authorization', `Bearer ${authToken}`)
            .send({
            userId: otherUser._id,
        });
        const otherUserLoginRes = await (0, supertest_1.default)(app_1.default)
            .post('/api/v1/auth/login')
            .send({
            email: otherUser.email,
            password: 'password123',
        });
        const otherUserAuthToken = otherUserLoginRes.body.data.token;
        await (0, supertest_1.default)(app_1.default)
            .post('/api/v1/users/friend-request/accept')
            .set('Authorization', `Bearer ${otherUserAuthToken}`)
            .send({
            userId: testUser._id,
        });
        // Unfriend
        const res = await (0, supertest_1.default)(app_1.default)
            .post('/api/v1/users/unfriend')
            .set('Authorization', `Bearer ${authToken}`)
            .send({
            userId: otherUser._id,
        });
        expect(res.statusCode).toEqual(200);
        expect(res.body.success).toBe(true);
        expect(res.body.message).toEqual('User unfriended');
        const updatedTestUser = await userModel_1.default.findById(testUser._id);
        const updatedOtherUser = await userModel_1.default.findById(otherUser._id);
        expect(updatedTestUser?.friends).not.toContainEqual(new mongoose_1.Types.ObjectId(otherUser._id));
        expect(updatedOtherUser?.friends).not.toContainEqual(new mongoose_1.Types.ObjectId(testUser._id));
    });
    it('should block a user', async () => {
        const res = await (0, supertest_1.default)(app_1.default)
            .post('/api/v1/users/block')
            .set('Authorization', `Bearer ${authToken}`)
            .send({
            userId: otherUser._id,
        });
        expect(res.statusCode).toEqual(200);
        expect(res.body.success).toBe.true;
        expect(res.body.message).toEqual('User blocked');
        const updatedTestUser = await userModel_1.default.findById(testUser._id);
        expect(updatedTestUser?.blockedUsers).toContainEqual(new mongoose_1.Types.ObjectId(otherUser._id));
    });
    it('should unblock a user', async () => {
        // Block first
        await (0, supertest_1.default)(app_1.default)
            .post('/api/v1/users/block')
            .set('Authorization', `Bearer ${authToken}`)
            .send({
            userId: otherUser._id,
        });
        // Unblock
        const res = await (0, supertest_1.default)(app_1.default)
            .post('/api/v1/users/unblock')
            .set('Authorization', `Bearer ${authToken}`)
            .send({
            userId: otherUser._id,
        });
        expect(res.statusCode).toEqual(200);
        expect(res.body.success).toBe(true);
        expect(res.body.message).toEqual('User unblocked');
        const updatedTestUser = await userModel_1.default.findById(testUser._id);
        expect(updatedTestUser?.blockedUsers).not.toContainEqual(new mongoose_1.Types.ObjectId(otherUser._id));
    });
    it('should update user profile', async () => {
        const res = await (0, supertest_1.default)(app_1.default)
            .put('/api/v1/users/profile')
            .set('Authorization', `Bearer ${authToken}`)
            .send({
            name: 'Updated Name',
            profilePhoto: 'http://example.com/new-photo.jpg',
        });
        expect(res.statusCode).toEqual(200);
        expect(res.body.success).toBe(true);
        expect(res.body.message).toEqual('Profile updated successfully');
        expect(res.body.data.name).toEqual('Updated Name');
        expect(res.body.data.profilePhoto).toEqual('http://example.com/new-photo.jpg');
        const updatedUser = await userModel_1.default.findById(testUser._id);
        expect(updatedUser?.name).toEqual('Updated Name');
        expect(updatedUser?.profilePhoto).toEqual('http://example.com/new-photo.jpg');
    });
    it('should change user password', async () => {
        const res = await (0, supertest_1.default)(app_1.default)
            .put('/api/v1/users/change-password')
            .set('Authorization', `Bearer ${authToken}`)
            .send({
            oldPassword: 'password123',
            newPassword: 'newsecurepassword',
        });
        expect(res.statusCode).toEqual(200);
        expect(res.body.success).toBe(true);
        expect(res.body.message).toEqual('Password changed successfully');
        // Try logging in with new password
        const loginRes = await (0, supertest_1.default)(app_1.default)
            .post('/api/v1/auth/login')
            .send({
            email: testUser.email,
            password: 'newsecurepassword',
        });
        expect(loginRes.statusCode).toEqual(200);
        expect(loginRes.body.success).toBe(true);
    });
    it('should not change password with incorrect old password', async () => {
        const res = await (0, supertest_1.default)(app_1.default)
            .put('/api/v1/users/change-password')
            .set('Authorization', `Bearer ${authToken}`)
            .send({
            oldPassword: 'wrongpassword',
            newPassword: 'newsecurepassword',
        });
        expect(res.statusCode).toEqual(401);
        expect(res.body.success).toBe(false);
        expect(res.body.message).toEqual('Invalid old password');
    });
});
