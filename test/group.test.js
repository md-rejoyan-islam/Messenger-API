"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const app_1 = __importDefault(require("../src/app/app"));
const userModel_1 = __importDefault(require("../src/models/userModel"));
const groupModel_1 = __importDefault(require("../src/models/groupModel"));
const mongoose_1 = require("mongoose");
describe('Group API', () => {
    let authToken;
    let testUser;
    let otherUser;
    beforeEach(async () => {
        await userModel_1.default.deleteMany({});
        await groupModel_1.default.deleteMany({});
        const registerRes = await (0, supertest_1.default)(app_1.default)
            .post('/api/v1/auth/register')
            .send({
            name: 'Test User',
            email: `test_user_${Date.now()}@example.com`,
            password: 'password123',
        });
        console.log('Group Test Register Response:', registerRes.body);
        expect(registerRes.statusCode).toEqual(201);
        expect(registerRes.body.success).toBe(true);
        authToken = registerRes.body.data.token;
        testUser = registerRes.body.data;
        const otherUserRes = await (0, supertest_1.default)(app_1.default)
            .post('/api/v1/auth/register')
            .send({
            name: 'Other User',
            email: `other_user_${Date.now()}@example.com`,
            password: 'password123',
        });
        console.log('Group Test Other User Register Response:', otherUserRes.body);
        expect(otherUserRes.statusCode).toEqual(201);
        expect(otherUserRes.body.success).toBe(true);
        otherUser = otherUserRes.body.data;
    });
    it('should create a new group', async () => {
        const res = await (0, supertest_1.default)(app_1.default)
            .post('/api/v1/groups')
            .set('Authorization', `Bearer ${authToken}`)
            .send({
            name: 'Test Group',
            members: [otherUser._id],
        });
        expect(res.statusCode).toEqual(201);
        expect(res.body.success).toBe(true);
        expect(res.body.data).toHaveProperty('_id');
        expect(res.body.data.name).toEqual('Test Group');
        expect(res.body.data.members).toContainEqual(testUser._id);
        expect(res.body.data.members).toContainEqual(otherUser._id);
    });
    it('should add a member to a group', async () => {
        const createGroupRes = await (0, supertest_1.default)(app_1.default)
            .post('/api/v1/groups')
            .set('Authorization', `Bearer ${authToken}`)
            .send({
            name: 'Test Group',
            members: [],
        });
        expect(createGroupRes.statusCode).toEqual(201);
        expect(createGroupRes.body.success).toBe(true);
        const groupId = createGroupRes.body.data._id;
        const res = await (0, supertest_1.default)(app_1.default)
            .post('/api/v1/groups/add-member')
            .set('Authorization', `Bearer ${authToken}`)
            .send({
            groupId,
            userId: otherUser._id,
        });
        expect(res.statusCode).toEqual(200);
        expect(res.body.success).toBe(true);
        expect(res.body.message).toEqual('Member added');
        const updatedGroup = await groupModel_1.default.findById(groupId);
        expect(updatedGroup?.members).toContainEqual(new mongoose_1.Types.ObjectId(otherUser._id));
    });
    it('should remove a member from a group', async () => {
        const createGroupRes = await (0, supertest_1.default)(app_1.default)
            .post('/api/v1/groups')
            .set('Authorization', `Bearer ${authToken}`)
            .send({
            name: 'Test Group',
            members: [otherUser._id],
        });
        expect(createGroupRes.statusCode).toEqual(201);
        expect(createGroupRes.body.success).toBe(true);
        console.log('Create Group Response for remove member test:', createGroupRes.body);
        const groupId = createGroupRes.body.data._id;
        const res = await (0, supertest_1.default)(app_1.default)
            .post('/api/v1/groups/remove-member')
            .set('Authorization', `Bearer ${authToken}`)
            .send({
            groupId,
            userId: otherUser._id,
        });
        expect(res.statusCode).toEqual(200);
        expect(res.body.success).toBe(true);
        expect(res.body.message).toEqual('Member removed');
        const updatedGroup = await groupModel_1.default.findById(groupId);
        expect(updatedGroup?.members).not.toContainEqual(new mongoose_1.Types.ObjectId(otherUser._id));
    });
});
