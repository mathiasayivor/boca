import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { createAvatar } from '@dicebear/avatars';
import * as style from '@dicebear/avatars-identicon-sprites';

import User from './models/UserModel.js';
import Chat from './models/ChatModel.js';
import Message from './models/MessageModel.js';
import Login from './models/LoginModel.js';
import { populateLogin } from './fixtures.js';

dotenv.config();

const DB_URL = process.env.DB_URL;

mongoose.connect(DB_URL);

export async function fetchChatsFromDB(
    chatId,
    startFrom = null,
    flatten = false
) {
    const query = {
        _id: chatId,
    };

    if (startFrom) {
        query.lastMessageAt = {
            $gt: startFrom,
        };
    }

    const chats = await Chat.find(query)
        .populate('users')
        .populate('messages')
        .populate('disables');

    return !flatten
        ? chats
        : chats.map((chat) => ({
              id: chat._id,
              messages: chat.messages.map(
                  ({ _id, user, content, addedAt }) => ({
                      id: _id,
                      sender: user._id,
                      content,
                      addedAt,
                  })
              ),
              createdAt: chat.createdAt,
              lastMessageAt: chat.lastMessageAt,
              isDisabled: chat.disables.length > 0,
          }));
}

export function userExists(userId) {
    try {
        return User.findOne({ _id: userId }) ? true : false;
    } catch (e) {
        return false;
    }
}

export async function getUser(loginId) {
    try {
        const login = await Login.findOne({ loginId }).populate('user');
        return {
            user: login.user,
            login,
        };
    } catch (e) {
        return {
            user: null,
            login: null,
        };
    }
}

export async function getUserId(loginId, returnLogin = false) {
    // const logins = await populateLogin();

    const { user, login } = await getUser(loginId);

    return returnLogin
        ? { userId: login?.user?._id ?? null, login }
        : login?.user?._id ?? null;
}

export async function revokeLoginId(loginId) {
    return await Login.findByIdAndDelete(loginId);
}

export async function regenerateLoginId(loginId) {
    const { userId, login } = await getUserId(loginId, true);

    const newLogin = await Login.create({
        _id: new mongoose.Types.ObjectId(),
        user: userId,
        createdAt: login.createdAt,
    });

    await revokeLoginId(loginId);

    return newLogin._id;
}

export async function saveMessage({ content, addedAt, userId, chatId }) {
    const chat = await Chat.findById(chatId)
        .populate('users')
        .populate('messages');

    const message = await Message.create({
        _id: new mongoose.Types.ObjectId(),
        user: userId,
        content,
        addedAt,
    });

    await chat.update({
        messages: [...chat.messages, message._id],
        lastMessageAt: addedAt,
    });

    return message;
}

/**
 *
 * @param {String[]} users
 */
export async function createChat(users) {
    return await Chat.create({
        _id: new mongoose.Types.ObjectId(),
        users,
    });
}

export async function login(email) {
    let user = await User.findOne({ email });
    if (!user) {
        const _id = new mongoose.Types.ObjectId();

        const icon = createAvatar(style, {
            seed: _id.toString(),
            dataUri: true,
        });

        user = await User.create({
            _id,
            email,
            icon,
        });
    }

    const login = await Login.create({
        _id: new mongoose.Types.ObjectId(),
        user: user._id,
    });

    return {
        user,
        login,
    };
}
// await populateLogin();
// console.log(await Login.find({}).limit(2));
