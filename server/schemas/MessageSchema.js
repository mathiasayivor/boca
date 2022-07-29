import mongoose from 'mongoose';
const { Schema } = mongoose;

export default new Schema({
    _id: Schema.Types.ObjectId,
    user: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    content: {
        type: String,
        required: true,
    },
    addedAt: {
        type: Date,
        default: Date.now,
    },
});
