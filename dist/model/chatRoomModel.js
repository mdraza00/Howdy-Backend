"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const chatRoomSchema = new mongoose_1.Schema({
    members: { type: [String], required: true },
    lastMessage: { type: String, default: "" },
    lastMessageVisibleTo: { type: [String] },
    lastMessageDate: { type: String, default: "" },
}, { timestamps: true });
const ChatRoom = (0, mongoose_1.model)("ChatRoom", chatRoomSchema);
exports.default = ChatRoom;
