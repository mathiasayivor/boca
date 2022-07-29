import mongoose from 'mongoose';
const { Schema } = mongoose;

export default new Schema({
    _id: Schema.Types.ObjectId,
    user: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});
