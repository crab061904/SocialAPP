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
exports.loginUser = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const User_model_1 = require("../models/User.model");
const secretKey = 'yourSecretKey'; // Replace this with an environment variable
// Corrected login handler with async and Promise<void>
const loginUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    try {
        // Find user by email
        const user = yield User_model_1.UserModel.findOne({ email });
        // If user doesn't exist, return an error response
        if (!user) {
            res.status(400).json({ message: 'Invalid credentials' });
            return;
        }
        // Compare entered password with hashed password
        const isMatch = yield bcryptjs_1.default.compare(password, user.password);
        // If password doesn't match, return an error response
        if (!isMatch) {
            res.status(400).json({ message: 'Invalid credentials' });
            return;
        }
        // Generate JWT token
        const token = jsonwebtoken_1.default.sign({ userId: user._id, email: user.email }, secretKey, { expiresIn: '1h' });
        // Send the token in the response
        res.status(200).json({ token });
    }
    catch (err) {
        // Send error response and avoid returning res
        res.status(500).json({ message: 'Error logging in' });
    }
});
exports.loginUser = loginUser;
exports.default = {
    loginUser: exports.loginUser
};
