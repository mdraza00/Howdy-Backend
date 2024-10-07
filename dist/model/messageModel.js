"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const message_1 = require("../enum/message");
const messageSchema = new mongoose_1.Schema({
    chatRoomId: String,
    senderId: String,
    messageType: {
        type: String,
        enum: message_1.MessageType,
        default: "text",
    },
    text: String,
    image: { name: String, caption: String, address: String },
    video: { name: String, caption: String, address: String },
    doc: { name: String, caption: String, address: String },
    visibleTo: [String],
    deletedFor: [String],
    deleteForEveryOne: { type: Number, default: 0 },
    replyTo: { type: String, default: undefined },
}, { timestamps: true });
const Message = (0, mongoose_1.model)("Message", messageSchema);
exports.default = Message;
