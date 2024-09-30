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
const messageModel_1 = __importDefault(require("../model/messageModel"));
const chatRoomModel_1 = __importDefault(require("../model/chatRoomModel"));
exports.default = {
    saveMessage: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { chatRoomId, senderId, text } = req.body;
            const chatroom = yield chatRoomModel_1.default.findOne({ _id: chatRoomId });
            const updatedChatRoom = yield chatRoomModel_1.default.findOneAndUpdate({ _id: chatRoomId }, {
                lastMessage: text,
                lastMessageDate: new Date().toString(),
                lastMessageVisibleTo: chatroom === null || chatroom === void 0 ? void 0 : chatroom.members,
            });
            const chatRoomMembers = updatedChatRoom
                ? updatedChatRoom.members
                : ["", ""];
            const message = yield messageModel_1.default.create({
                chatRoomId,
                senderId,
                text,
                visibleTo: chatRoomMembers,
            });
            res.status(200).json({
                status: true,
                message: message,
            });
        }
        catch (err) {
            res.status(500).json({
                status: false,
                message: null,
            });
        }
    }),
    getRoomMessages: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { roomId } = req.params;
        try {
            const messages = yield messageModel_1.default.find({ chatRoomId: roomId }).sort({
                createdAt: 1,
            });
            if (messages.length === 0) {
                res.status(200).json({ status: true, data: [] });
            }
            else {
                const updatedMessages = messages.map((message) => {
                    return message.deleteForEveryOne == 0
                        ? message
                        : Object.assign(Object.assign({}, message.toObject()), { text: "message has been deleted" });
                });
                yield chatRoomModel_1.default.findOneAndUpdate({ _id: roomId }, {
                    lastMessage: updatedMessages[updatedMessages.length - 1].text,
                });
                res.status(200).json({ status: true, data: updatedMessages });
            }
        }
        catch (err) {
            res.json(500).json({
                status: false,
                message: "some error has occured",
            });
        }
    }),
    ClearChatRoomMessages: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { chatroomId, userId } = req.body;
        try {
            const chatroom = yield chatRoomModel_1.default.findOne({ _id: chatroomId });
            const messages = yield messageModel_1.default.find({ chatRoomId: chatroomId });
            messages.forEach((message) => __awaiter(void 0, void 0, void 0, function* () {
                const visibleTo = message.visibleTo.filter((visibleToMember) => visibleToMember !== userId);
                yield messageModel_1.default.findByIdAndUpdate(message._id.toString(), { visibleTo });
            }));
            const updatedMessages = yield messageModel_1.default.find({ chatRoomId: chatroomId });
            const visibleTo = chatroom === null || chatroom === void 0 ? void 0 : chatroom.lastMessageVisibleTo.filter((visibleToMember) => visibleToMember !== userId);
            yield chatRoomModel_1.default.findByIdAndUpdate(chatroomId, {
                lastMessageVisibleTo: visibleTo,
            });
            res.status(200).json({
                status: true,
                data: updatedMessages,
            });
        }
        catch (err) {
            res.status(500).json({
                status: false,
                data: {},
            });
        }
    }),
    deleteForMe: function (req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { messages, userId, chatroomId } = req.params;
                const messagesId = messages
                    .split("__")
                    .map((message) => message.split("--")[0]);
                messagesId.forEach((messageId) => __awaiter(this, void 0, void 0, function* () {
                    const message = yield messageModel_1.default.findById(messageId);
                    const deletedFor = message && message.deletedFor ? message.deletedFor : [];
                    const visibleTo = message &&
                        message.visibleTo.filter((visibleToId) => visibleToId != userId);
                    yield messageModel_1.default.findOneAndUpdate({ _id: messageId }, { deletedFor: [...deletedFor, userId], visibleTo });
                }));
                res.status(200).json({
                    status: true,
                    data: "messages deleted for you successfully",
                });
            }
            catch (err) {
                res.status(500).json({
                    status: false,
                    data: "error in deleted messages for you",
                });
            }
        });
    },
    deleteForEveryOne: function (req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { messages, chatroomId } = req.params;
                const messagesId = messages
                    .split("__")
                    .map((message) => message.split("--")[0]);
                messagesId.forEach((messageId) => __awaiter(this, void 0, void 0, function* () {
                    yield messageModel_1.default.findOneAndUpdate({ _id: messageId }, {
                        deleteForEveryOne: 1,
                    });
                }));
                const updatedMessages = yield messageModel_1.default.find({
                    chatRoomId: chatroomId,
                }).sort({
                    createdAt: 1,
                });
                res.status(200).json({
                    status: true,
                    message: "message deleted successfully",
                });
            }
            catch (err) {
                res.status(500).json({
                    status: false,
                    message: [],
                });
            }
        });
    },
};
