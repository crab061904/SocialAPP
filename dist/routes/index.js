"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRoutes = exports.loginUser = exports.deleteUser = exports.updateUser = exports.getAllUsers = exports.getUserProfile = exports.createUser = void 0;
// index.ts in the routes folder
// Import all individual route files
const login_route_1 = require("./login.route"); // Assuming your `createUser` is in `auth.route.ts`
Object.defineProperty(exports, "createUser", { enumerable: true, get: function () { return login_route_1.createUser; } });
const login_route_2 = require("./login.route"); // Assuming your `getUserProfile` is in `login.route.ts`
Object.defineProperty(exports, "getUserProfile", { enumerable: true, get: function () { return login_route_2.getUserProfile; } });
const login_route_3 = require("./login.route"); // Assuming the functions are in `user.route.ts`
Object.defineProperty(exports, "getAllUsers", { enumerable: true, get: function () { return login_route_3.getAllUsers; } });
const login_route_4 = require("./login.route"); // Same for `updateUser`
Object.defineProperty(exports, "updateUser", { enumerable: true, get: function () { return login_route_4.updateUser; } });
const login_route_5 = require("./login.route"); // Same for `deleteUser`
Object.defineProperty(exports, "deleteUser", { enumerable: true, get: function () { return login_route_5.deleteUser; } });
const auth_route_1 = require("./auth.route"); // Same for `loginUser`
Object.defineProperty(exports, "loginUser", { enumerable: true, get: function () { return auth_route_1.loginUser; } });
var auth_route_2 = require("./auth.route");
Object.defineProperty(exports, "authRoutes", { enumerable: true, get: function () { return __importDefault(auth_route_2).default; } });
