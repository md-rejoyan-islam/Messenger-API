import request from 'supertest';
import app from '../src/app/app';
import User from '../src/models/userModel';
import Group from '../src/models/groupModel';
import { Types } from 'mongoose';

describe('Group API', () => {
  let authToken: string;
  let testUser: any;
  let otherUser: any;

  beforeEach(async () => {
    await User.deleteMany({});
    await Group.deleteMany({});

    const registerRes = await request(app)
      .post('/api/users/register')
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

    const otherUserRes = await request(app)
      .post('/api/users/register')
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
    const res = await request(app)
      .post('/api/groups')
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
    const createGroupRes = await request(app)
      .post('/api/groups')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        name: 'Test Group',
        members: [],
      });
    expect(createGroupRes.statusCode).toEqual(201);
    expect(createGroupRes.body.success).toBe(true);
    const groupId = createGroupRes.body.data._id;

    const res = await request(app)
      .post('/api/groups/add-member')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        groupId,
        userId: otherUser._id,
      });
    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toEqual('Member added');

    const updatedGroup = await Group.findById(groupId);
    expect(updatedGroup?.members).toContainEqual(new Types.ObjectId(otherUser._id));
  });

  it('should remove a member from a group', async () => {
    const createGroupRes = await request(app)
      .post('/api/groups')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        name: 'Test Group',
        members: [otherUser._id],
      });
    expect(createGroupRes.statusCode).toEqual(201);
    expect(createGroupRes.body.success).toBe(true);
    console.log('Create Group Response for remove member test:', createGroupRes.body);
    const groupId = createGroupRes.body.data._id;

    const res = await request(app)
      .post('/api/groups/remove-member')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        groupId,
        userId: otherUser._id,
      });
    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toEqual('Member removed');

    const updatedGroup = await Group.findById(groupId);
    expect(updatedGroup?.members).not.toContainEqual(new Types.ObjectId(otherUser._id));
  });
});
