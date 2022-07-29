import mongoose from 'mongoose';
const { Schema } = mongoose;

export default new Schema({
    _id: Schema.Types.ObjectId,
    icon: String,
    isAnonymous: {
        type: Boolean,
        default: false,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    registeredAt: {
        type: Date,
        default: Date.now,
    },
    lastSeenAt: {
        type: Date,
        default: Date.now,
    },
});
