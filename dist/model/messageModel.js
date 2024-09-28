"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const messageSchema = new mongoose_1.Schema({
    chatRoomId: String,
    senderId: String,
    text: String,
    visibleTo: [String],
    deletedFor: [String],
    deleteForEveryOne: Number,
}, { timestamps: true });
const Message = (0, mongoose_1.model)("Message", messageSchema);
exports.default = Message;
