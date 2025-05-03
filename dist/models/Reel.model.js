"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReelModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const CommentSchema = new mongoose_1.default.Schema({
    user: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    text: {
        type: String,
        required: true,
    },
    ceatedAt: {
        type: Date,
        default: Date.now
    }
});
const ReelSchema = new mongoose_1.default.Schema({
    user: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    videoUrl: {
        type: String,
        required: true
    },
    caption: [{
            type: String,
            required: true
        }],
    likes: [{
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: 'User',
            default: [], // Array of user IDs who liked the Reel
        }],
    comments: [CommentSchema],
    ceatedAt: {
        type: Date,
        default: Date.now
    },
    share: [{
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: 'User',
            default: [], // Array of user IDs who liked the Reel
        }],
    views: {
        type: Number,
        default: 0
    },
    visibility: {
        type: String,
        enum: ['public', 'department', 'org'],
        default: ""
    },
    tags: [{
            type: String,
            default: ""
        }],
    relatedCourse: {
        type: String,
        default: ''
    }
});
exports.ReelModel = mongoose_1.default.model('Reel', ReelSchema);
