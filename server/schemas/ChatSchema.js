import mongoose from 'mongoose';
const { Schema } = mongoose;

export default new Schema({
    _id: Schema.Types.ObjectId,
    users: [
        {
            type: Schema.Types.ObjectId,
            required: true,
            ref: 'User',
        },
    ],
    messages: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Message',
        },
    ],
    createdAt: {
        type: Date,
        default: Date.now,
    },
    lastMessageAt: {
        type: Date,
        default: Date.now,
    },
    disables: [
        {
            type: Schema.Types.ObjectId,
            ref: 'User',
        },
    ],
});
