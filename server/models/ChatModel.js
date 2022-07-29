import mongoose from 'mongoose';
import ChatSchema from '../schemas/ChatSchema.js';

export default mongoose.model('Chat', ChatSchema);
