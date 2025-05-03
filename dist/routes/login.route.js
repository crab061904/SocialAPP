"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.updateUser = exports.getAllUsers = exports.getUserProfile = exports.createUser = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const User_model_1 = require("../models/User.model");
// Create user
const createUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, email, password } = req.body;
    try {
        // Check if the user exists
        const existingUser = yield User_model_1.UserModel.findOne({ $or: [{ email }, { username }] });
        if (existingUser) {
            res.status(400).json({ message: 'User already exists' });
            return; // Exit the function after sending the response
        }
        // Hash password before saving
        const salt = yield bcryptjs_1.default.genSalt(10);
        const hashedPassword = yield bcryptjs_1.default.hash(password, salt);
        const newUser = new User_model_1.UserModel({ username, email, password: hashedPassword });
        yield newUser.save();
        res.status(201).json({ message: 'User created successfully', user: newUser });
    }
    catch (err) {
        res.status(500).json({ message: 'Error creating user' });
    }
});
exports.createUser = createUser;
// Get user profile
const getUserProfile = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.params;
    try {
        const user = yield User_model_1.UserModel.findById(userId);
        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return; // Exit the function after sending the response
        }
        res.status(200).json(user);
    }
    catch (err) {
        res.status(500).json({ message: 'Error retrieving user profile' });
    }
});
exports.getUserProfile = getUserProfile;
// List all users (Admin-only)
const getAllUsers = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield User_model_1.UserModel.find();
        res.status(200).json(users);
    }
    catch (err) {
        res.status(500).json({ message: 'Error retrieving users' });
    }
});
exports.getAllUsers = getAllUsers;
// Update user
const updateUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.params;
    const { username, email, avatar, bio, role } = req.body;
    try {
        const updatedUser = yield User_model_1.UserModel.findByIdAndUpdate(userId, { username, email, avatar, bio, role }, { new: true } // Return the updated user
        );
        if (!updatedUser) {
            res.status(404).json({ message: 'User not found' });
            return; // Exit the function after sending the response
        }
        res.status(200).json(updatedUser);
    }
    catch (err) {
        res.status(500).json({ message: 'Error updating user' });
    }
});
exports.updateUser = updateUser;
// Delete user
const deleteUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.params;
    try {
        const deletedUser = yield User_model_1.UserModel.findByIdAndDelete(userId);
        if (!deletedUser) {
            res.status(404).json({ message: 'User not found' });
            return; // Exit the function after sending the response
        }
        res.status(200).json({ message: 'User deleted successfully' });
    }
    catch (err) {
        res.status(500).json({ message: 'Error deleting user' });
    }
});
exports.deleteUser = deleteUser;
exports.default = {
    createUser: exports.createUser,
    getUserProfile: exports.getUserProfile,
    getAllUsers: exports.getAllUsers,
    updateUser: exports.updateUser,
    deleteUser: exports.deleteUser,
};
