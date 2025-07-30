import dotenv from 'dotenv';
import http from 'http';
import { Server } from 'socket.io';
import socketHandler from './app/socketHandler';
import connectDB from './config/db';

dotenv.config();

import app from './app/app';
import secret from './app/secret';

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: secret.clientUrl,
    methods: ['GET', 'POST'],
  },
});

socketHandler(io);

server.listen(secret.port, () => {
  connectDB();
  console.log(`Server running on http://localhost:${secret.port}`);
});
