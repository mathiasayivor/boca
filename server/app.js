import { Server, Socket } from 'socket.io';

import {
    createChat,
    fetchChatsFromDB,
    getUser,
    regenerateLoginId,
    saveMessage,
} from './api.js';

// Type Defs
/** @typedef {{id: string, sockets: string[], logins: string[], socketConnections: Socket[]}} ActiveUser */

// Time Setting
const A_SECOND = 1000;
const A_MINUTE = A_SECOND * 60;
const AN_HOUR = A_MINUTE * 60;

// Config
const USER_INACTIVE_LIFE = AN_HOUR * 1; // Duration after which a user would be considered loggedOut
const ENGINE_FIRING_ORDER = A_SECOND * 10; // Interval before next engine fired

/** @type {ActiveUser[]} */
const waitingQueue = [];

/** @type {{[key: string]: ActiveUser}} */
const activeUsersCache = {};

/** @type {{[key: string]: string|number}} */
const logoutQueue = {};

/** @type {{[key: string]: String[]}} */
const chatsCache = {};

/**
 * Main Engine for Pairing users
 */
export async function runPairEngine() {
    // console.log('pairing...');
    if (waitingQueue.length >= 2) {
        const users = waitingQueue.splice(0, 2);

        const chat = await createChat(users.map((user) => user.id));

        users.forEach((user) => {
            cacheChat(user.id, chat._id.toString());
            user.socketConnections.forEach((socket) =>
                socket.join(chat._id.toString())
            );
        });

        console.log('paired two users, ', users[0].id, users[1].id);
    } else {
        // console.log('no users in queue. Waiting for next order');
    }

    setTimeout(async () => {
        await runPairEngine();
    }, ENGINE_FIRING_ORDER);
}

/**
 *
 * @param {String} userId
 * @param {{socket: Socket, loginId: string}} data
 */
function cacheUser(userId, { socket, loginId }) {
    if (!(activeUsersCache[userId] instanceof Array)) {
        activeUsersCache[userId] = {
            id: userId,
            sockets: [],
            logins: [],
            socketConnections: [],
        };
    }

    if (socket) {
        activeUsersCache[userId].sockets.push(socket.id);
        activeUsersCache[userId].socketConnections.push(socket);
    }

    if (loginId) {
        activeUsersCache[userId].logins.push(loginId);
    }
}

// This could reach a time complexity of O(nU*nUS) [no_users * no_user_socket]
// that would be worst case though will think of a better optimization later
function fetchActiveUser({ socketId, loginId }) {
    for (let id in activeUsersCache) {
        const user = activeUsersCache[id];
        if (user.sockets.includes(socketId) || user.logins.includes(loginId)) {
            return user;
        }
    }

    return null;
}

function cacheChat(userId, chatId) {
    if (chatsCache[userId] instanceof Array) {
        chatsCache[userId].push(chatId);
        return;
    }

    chatsCache[userId] = [chatId];
}

/**
 *
 * @param {Server} io
 * @param {string} userId
 * @param {string} status
 */
function setUserAvailabilityForChats(io, userId, status) {
    const chats = chatsCache[userId];

    if (chats instanceof Array) {
        chats.forEach((chat) => {
            io.to(chat).emit(`user-${status}`, userId);
        });

        // Set lastSeen in DB to currDate
    }
}

function dequeueUserFromLogout(userId) {
    const logoutId = logoutQueue[userId];
    if (logoutId) {
        clearTimeout(logoutId);
        delete logoutQueue[userId];
    }
}

function disableChat(chatId) {
    io.to(chatId).emit('chat-disabled');
    // Set chatDisabled = true in DB
}

function fetchCachedChats(userId) {
    const chats = chatsCache[userId];

    return chats instanceof Array ? chats : [];
}

/**
 *
 * @param {Socket} socket
 * @param {string[]} chats
 */
function joinChats(socket, chats) {
    if (!(chats instanceof Array)) {
        return;
    }

    chats.forEach((chat) => {
        socket.join(chat);
        socket.emit('user.pair-joined', chat);
    });
}

function logoutUser(user) {
    const chats = fetchCachedChats(user.id);

    if (user.isAnonymous) {
        chats.forEach((chat) => {
            disableChat(chat);
        });

        // Delete all of user's data
        /**
         * When user next opens app
         */
    }

    if (activeUsersCache[user.id]) {
        delete activeUsersCache[user.id];
    }

    chats.forEach((chat) => {
        io.to(chat).emit('user-logout');
    });
}

/**
 *
 * @param {String} userId
 * @param {Server} io
 * @param {Socket} socket
 * @returns {Boolean} true if user is in queue and message was sent, false otherwise
 */
function checkWaitingQueueAndNotifyUser(userId, socket, io) {
    return waitingQueue.find((userInQueue) => {
        if (userInQueue.id !== userId) {
            return false;
        }

        console.log(userInQueue.id, userId);

        io.to(socket.id).emit('user.pair-waiting');
        console.log('pairing opended for ', socket.id);
        return true;
    })
        ? true
        : false;
}

/**
 *
 * @param {Socket} socket
 * @param {Server} io
 */
export function onSocketConnected(socket, io) {
    console.log('user conneced', socket.id);
    socket.on('app.init', async ({ userId, loginId }) => {
        const user = (await getUser(loginId)).user;
        console.log(
            'user connected, socket = %s, user = %s',
            socket.id,
            user.id
        );

        // const newLoginId = await regenerateLoginId(loginId);
        // cacheUser(user.id, { loginId: newLoginId });

        // io.to(socket.id).emit('app.update-login', newLoginId);

        // Doing this so that we can broadcast to email users on multiple devices
        socket.join([loginId, user._id.toString()]);

        dequeueUserFromLogout(user.id);
        setUserAvailabilityForChats(io, user.id, 'online');
        cacheUser(user._id.toString(), { socket, loginId });

        const cachedChats = fetchCachedChats(user.id);

        checkWaitingQueueAndNotifyUser(user.id, socket, io);

        if (cachedChats.length > 0) {
            joinChats(socket, cachedChats);
            (await fetchChatsFromDB(user.id, user.lastSeen, true)).forEach(
                (chat) => {
                    /**
                     * NOTE: Here's a pseudo_code for how the merging would
                     *
                     * if (frontend.cachedChats.includes(chat.id)) {
                     *  appendToChat(chat.id, chat.messages)
                     * } else {
                     *  It means this chat/message was created whiles the user went offline
                     *  frontend.cachedChats.push(chat)
                     * }
                     */
                    io.to(socket.id).emit('chat.append', chat);
                }
            );
        } else {
            (await fetchChatsFromDB(user.id, null, true)).forEach((chat) => {
                io.to(socket.id).emit('chat.add', chat);
            });
        }
    });

    socket.on('app.open-chat', ({ loginId, chatId }) => {
        const user = fetchActiveUser({ socketId: socket.id, loginId });

        if (!user) {
            // Invalid LoginId
            io.to(chatId).emit('app.force-logout');
        }
    });

    socket.on('user.pair-open', ({ loginId }, done) => {
        const user = fetchActiveUser({ socketId: socket.id, loginId });

        if (!user) {
            io.to(socket.id).emit('app.force-logout');
            return;
        }

        // User is already in queue
        if (checkWaitingQueueAndNotifyUser(user.id, socket, io)) {
            return;
        }

        waitingQueue.push(user);
        io.to(socket.id).emit('user.pair-waiting');

        console.log('pairing opended for ', socket.id);
        done();
    });

    socket.on(
        'message.add',
        async ({ chatId, content, addedAt, loginId }, received) => {
            console.log(chatId, content, addedAt, loginId);
            received();
            return;
            const user = fetchActiveUser({ socketId: socket.id, loginId });

            await saveMessage({
                content,
                addedAt,
                userId: user.id,
                chatId,
            });

            io.to(chatId).emit('message.added', {
                content,
                addedAt,
                sender: user.id,
            });
        }
    );

    socket.on('disconnect', () => {
        onSocketDisconnected(socket.id, io);
    });
}

/**
 *
 * @param {Socket} socket socket.id that was obtained when user connected
 * @param {Server} io
 */
function onSocketDisconnected(socket, io) {
    const user = fetchActiveUser({ socketId: socket.id });

    if (!user) {
        return; // Somehow this socket was not cached
    }

    const userId = user.id;

    const queueId = setTimeout(() => {
        logoutUser(user);
    }, USER_INACTIVE_LIFE);

    if (logoutQueue[userId] instanceof Array) {
        logoutQueue[userId].push(queueId);
    } else {
        logoutQueue[userId] = [queueId];
    }

    setUserAvailabilityForChats(io, userId, 'offline');
}
