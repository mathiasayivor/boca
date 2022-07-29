import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import randomstring from 'randomstring';
import User from './models/UserModel.js';
import Login from './models/LoginModel.js';

export async function populateUser(
    emailUsersCount = 5,
    anonymousUsersCount = 5
) {
    let emailUsers = [];
    let anonymousUsers = [];

    const users = await User.find({});
    for (let i = 0; i < users.length; i++) {
        await User.deleteOne({
            _id: users[i]._id,
        });
    }

    for (let i = 0; i < emailUsersCount; i++) {
        const email =
            randomstring.generate(5) + '@' + randomstring.generate(7) + '.com';

        const user = await User.create({
            _id: new mongoose.Types.ObjectId(),
            email,
        });

        emailUsers.push(user);
    }

    for (let i = 0; i < anonymousUsersCount; i++) {
        const user = await User.create({
            _id: new mongoose.Types.ObjectId(),
            email: uuidv4() + '@anonymous.com',
            isAnonymous: true,
        });

        anonymousUsers.push(user);
    }

    return {
        emailUsers,
        anonymousUsers,
    };
}

export async function populateLogin(
    emailUsersCount = 5,
    anonymousUsersCount = 5
) {
    const logins_ = await Login.find({});
    for (let i = 0; i < logins_.length; i++) {
        await Login.deleteOne({
            _id: logins_[i]._id,
        });
    }

    const users = await populateUser();
    const logins = {
        emailLogins: [],
        anonymousLogins: [],
    };

    users.emailUsers.forEach(async (user) => {
        for (let i = 0; i < emailUsersCount; i++) {
            const login = await Login.create({
                _id: new mongoose.Types.ObjectId(),
                user: user._id,
            });

            logins.emailLogins.push(login);
        }
    });

    users.anonymousUsers.forEach(async (user) => {
        for (let i = 0; i < anonymousUsersCount; i++) {
            const login = await Login.create({
                _id: new mongoose.Types.ObjectId(),
                user: user._id,
            });

            logins.anonymousLogins.push(login);
        }
    });
}
