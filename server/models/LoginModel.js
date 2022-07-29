import mongoose from 'mongoose';
import LoginSchema from '../schemas/LoginSchema.js';

export default mongoose.model('Login', LoginSchema);
