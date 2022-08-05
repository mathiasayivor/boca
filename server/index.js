import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import express from 'express';
import http from 'http';
import { Server, Socket } from 'socket.io';

import { onSocketConnected, runPairEngine } from './app.js';
import { login } from './api.js';
dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: '*',
    },
});

const SERVER_PORT = process.env.PORT || 4000;

app.use(express.json()).use(cors());

app.get('/', (req, res) => {
    res.sendFile(path.resolve('./index.html'));
});

app.post('/login', async (req, res) => {
    const { email, isAnonymous } = req.body;
    if (!email) {
        res.status(401).json({
            message: 'Email is required',
        });
        return;
    }

    const { login: _login, user } = await login(email, isAnonymous ?? false);

    res.json({
        icon: user.icon,
        loginId: _login._id,
        userId: user._id,
        message: 'Login successful!',
    });
});

io.on('connection', (socket) => {
    onSocketConnected(socket, io);
});

server.listen(SERVER_PORT, async () => {
    console.log('listening on port ' + SERVER_PORT);
    runPairEngine();
});
