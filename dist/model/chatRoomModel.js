"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const chatRoomSchema = new mongoose_1.Schema({
    members: Array,
    lastMessage: { type: String, default: "" },
    lastMessageDate: { type: String, default: "" },
}, { timestamps: true });
const ChatRoom = (0, mongoose_1.model)("ChatRoom", chatRoomSchema);
exports.default = ChatRoom;
