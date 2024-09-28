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
        const { chatRoomId, senderId, text } = req.body;
        const updatedChatRoom = yield chatRoomModel_1.default.findOneAndUpdate({ _id: chatRoomId }, { lastMessage: text, lastMessageDate: new Date().toString() });
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
            status: "success",
            message: "data is stored",
        });
    }),
    getRoomMessages: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { roomId } = req.params;
        try {
            const messages = yield messageModel_1.default.find({ chatRoomId: roomId }).sort({
                createdAt: 1,
            });
            res.status(200).json({ status: true, data: messages });
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
            const messages = yield messageModel_1.default.find({ chatRoomId: chatroomId });
            messages.forEach((message) => __awaiter(void 0, void 0, void 0, function* () {
                const visibleTo = message.visibleTo.filter((visibleToMember) => visibleToMember !== userId);
                yield messageModel_1.default.findByIdAndUpdate(message._id.toString(), { visibleTo });
            }));
            res.status(200).json({
                status: true,
                message: "messages cleared successfully",
            });
        }
        catch (err) {
            res.status(500).json({
                status: false,
                message: "error in clearing messages",
            });
        }
    }),
    deleteSelectedMessages: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { ids } = req.params;
            const messagesIdArray = ids.split("--");
            messagesIdArray.forEach((messageId) => __awaiter(void 0, void 0, void 0, function* () { return yield messageModel_1.default.findByIdAndDelete(messageId); }));
            res.status(200).json({
                status: true,
                message: "messages deleted successfully",
            });
        }
        catch (err) {
            res.status(500).json({
                status: false,
                message: "failed to delete selected messages",
            });
        }
    }),
};
