"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require('dotenv').config(); // Make sure this is at the very top
const methodOverride = require('method-override');
const morgan = require('morgan');
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const index_1 = require("./routes/index");
const index_2 = require("./middleware/index");
const app = (0, express_1.default)();
app.use(express_1.default.json()); // for parsing application/json
// Check if MONGO_URI is available in the environment variables
if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI is not defined in .env file');
}
// User routes
app.post('/user/create', index_1.createUser); // Register
app.post('/login', index_1.loginUser); // Login
// CRUD operations (protected routes)
app.get('/users', index_2.verifyToken, index_1.getAllUsers); // List all users (Admin only)
app.get('/user/:userId', index_2.verifyToken, index_1.getUserProfile); // Get profile by ID
app.put('/user/:userId', index_2.verifyToken, index_1.updateUser); // Update user
app.delete('/user/:userId', index_2.verifyToken, index_1.deleteUser); // Delete user
mongoose_1.default
    .connect(process.env.MONGO_URI)
    .then(() => {
    console.log('Connected to database!');
    app.listen(3000, () => {
        console.log('Server is running on port 3000');
    });
})
    .catch((error) => {
    console.log('Connection Failed!', error);
});
