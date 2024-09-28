"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const profilePhoto = new mongoose_1.Schema({
    filename: String,
    fileAddress: String,
});
const userSchema = new mongoose_1.Schema({
    username: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    profilePhoto: profilePhoto,
    about: { type: String, default: "Hey there! I am using Howdy." },
});
userSchema.index({ username: 1 });
const User = (0, mongoose_1.model)("User", userSchema);
exports.default = User;
