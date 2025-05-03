"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const secretKey = 'Secret'; // Replace with a secure environment variable
// Explicitly type 'req', 'res', and 'next'
const verifyToken = (req, res, next) => {
    var _a;
    const token = (_a = req.header('Authorization')) === null || _a === void 0 ? void 0 : _a.replace('Bearer ', '');
    if (!token) {
        // Handle no token provided
        res.status(401).json({ message: 'No token provided, access denied.' });
        return; // Don't return a value; just stop further execution here
    }
    try {
        // Decode the token using JWT and attach the user information to the request object
        const decoded = jsonwebtoken_1.default.verify(token, secretKey);
        req.user = decoded; // Attach decoded user data to req.user
        next(); // Pass control to the next middleware or route handler
    }
    catch (err) {
        // If token verification fails, send an error response
        res.status(400).json({ message: 'Invalid token.' });
    }
};
exports.verifyToken = verifyToken;
