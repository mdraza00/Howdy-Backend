"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const chatroomType_1 = require("../enum/chatroomType");
const chatRoomSchema = new mongoose_1.Schema({
    chatroomType: { type: String, default: chatroomType_1.CHATROOM_TYPE.PRIVATE },
    members: { type: [String], required: true },
    chatroomProfilePhoto: { type: String, default: "" },
    groupDescription: { type: String, default: "" },
    chatroomName: { type: "String", default: "" },
    lastMessage: { type: String, default: "" },
    lastMessageVisibleTo: { type: [String] },
    lastMessageDate: { type: String, default: "" },
    about: { type: String, default: "" },
}, { timestamps: true });
const ChatRoom = (0, mongoose_1.model)("ChatRoom", chatRoomSchema);
exports.default = ChatRoom;
