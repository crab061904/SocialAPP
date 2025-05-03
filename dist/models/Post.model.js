"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const comments_model_1 = require("./comments.model");
const PostSchema = new mongoose_1.default.Schema({
    user: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    text: {
        type: String,
    },
    media: [{
            type: String
        }],
    likes: [{
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: 'User',
            default: [], // Array of user IDs who liked the post
        }],
    comments: [comments_model_1.CommentModel],
});
exports.PostModel = mongoose_1.default.model('Post', PostSchema);
