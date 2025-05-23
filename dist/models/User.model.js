"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const UserSchema = new mongoose_1.default.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    avatar: {
        type: String,
        default: '',
    },
    bio: {
        type: String,
        default: '',
    },
    role: {
        type: String,
        enum: ['student', 'professor', 'admin'],
        default: 'student',
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});
exports.UserModel = mongoose_1.default.model('User', UserSchema);
