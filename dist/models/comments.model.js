"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommentModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const CommentSchema = new mongoose_1.default.Schema({
    user: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    parent: {
        type: String,
        enum: ["Post", "Reel"],
        id: {
            type: mongoose_1.default.Schema.Types.ObjectId,
            required: true
        }
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
exports.CommentModel = mongoose_1.default.model('CommentSchema', CommentSchema);
