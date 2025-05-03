"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const slugify_1 = __importDefault(require("slugify"));
// Define the schema
const StoriesSchema = new mongoose_1.default.Schema({
    user: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    Type_Of_Story: {
        type: String,
        enum: ['image', 'text'],
    },
    text: {
        type: String,
    },
    textStyle: {
        fontSize: {
            type: Number,
            default: 14,
        },
        position: {
            x: {
                type: Number,
                default: 0,
            },
            y: {
                type: Number,
                default: 0,
            },
        },
        background: {
            type: String,
            default: 'bg-gradient-to-tr from-blue-400 to-purple-500',
        },
    },
    media: [
        {
            type: String,
        },
    ],
    likes: [
        {
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: 'User',
            default: [], // Array of user IDs who liked the story
        },
    ],
    visibility: {
        type: String,
        enum: ['public', 'department', 'org'],
        default: 'public',
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    expiresAt: {
        type: Date,
        default: () => Date.now() + 24 * 60 * 60 * 1000, // 24 hours from creation
    },
    slug: {
        type: String,
        unique: true,
        set: (value) => (0, slugify_1.default)(value, { lower: true, strict: true }), // Set the value type as string
    },
});
module.exports = mongoose_1.default.model('Story', StoriesSchema);
