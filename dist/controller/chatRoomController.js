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
const chatRoomModel_1 = __importDefault(require("../model/chatRoomModel"));
const messageModel_1 = __importDefault(require("../model/messageModel"));
const userModel_1 = __importDefault(require("../model/userModel"));
const chatroomType_1 = require("../enum/chatroomType");
exports.default = {
    createOrGetChatRoom: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { senderId, recipientId } = req.body;
        try {
            let chatRoom = yield chatRoomModel_1.default.findOne({
                members: { $all: [senderId, recipientId] },
            });
            if (!chatRoom) {
                chatRoom = yield chatRoomModel_1.default.create({ members: [senderId, recipientId] });
            }
            res.status(200).json({
                status: true,
                message: chatRoom._id,
            });
        }
        catch (err) {
            res.status(500).json({
                status: false,
                message: err,
            });
        }
    }),
    createGroup: function (req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { members, chatroomName, groupDescription } = req.body;
            const chatroomProfilePhoto = req.file;
            const groupMembers = members.split("__");
            const imageAddress = chatroomProfilePhoto
                ? (chatroomProfilePhoto === null || chatroomProfilePhoto === void 0 ? void 0 : chatroomProfilePhoto.destination.slice(6)) +
                    "/" +
                    (chatroomProfilePhoto === null || chatroomProfilePhoto === void 0 ? void 0 : chatroomProfilePhoto.filename)
                : "";
            const group = yield chatRoomModel_1.default.create({
                chatroomType: chatroomType_1.CHATROOM_TYPE.GROUP,
                members: groupMembers,
                chatroomProfilePhoto: imageAddress,
                groupDescription: groupDescription,
                chatroomName: chatroomName,
                lastMessage: "",
                lastMessageVisibleTo: groupMembers,
                lastMessageDate: "",
                about: "",
            });
            res.status(200).json({
                status: true,
                message: group._id.toString(),
            });
        });
    },
    getChatRooms: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { currentUserId } = req.body;
        try {
            const chatRooms = yield chatRoomModel_1.default.find({
                members: { $in: [currentUserId] },
            });
            if (chatRooms) {
                console.log(chatRooms);
                res.status(200).json({
                    status: true,
                    data: chatRooms,
                });
            }
            else {
                res.status(404).json({
                    status: false,
                    data: null,
                });
            }
        }
        catch (err) {
            res.status(500).json({
                status: "fail",
                message: `error = ${err}`,
            });
        }
    }),
    getMyChatRoomMembers: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { userId } = req.params;
        try {
            const chatrooms = yield chatRoomModel_1.default.find({ members: { $in: [userId] } });
            const usersId = chatrooms.map((chatroom) => chatroom.members.filter((id) => id !== userId)[0]);
            const users = yield userModel_1.default.find({ _id: { $in: usersId } });
            const usersData = users.map((user) => {
                var _a;
                return {
                    _id: user._id.toString(),
                    email: user.email,
                    username: user.username,
                    profilePhotoAddress: (_a = user.profilePhoto) === null || _a === void 0 ? void 0 : _a.fileAddress,
                };
            });
            res.status(200).json({
                status: true,
                message: usersData,
            });
        }
        catch (err) {
            res.status(500).json({
                status: "fail",
                message: `error = ${err}`,
            });
        }
    }),
    getChatRoomMembersByName: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { userId, username } = req.params;
        const usernameStartsWithRegEx = new RegExp(`^${username}`, "i");
        try {
            const chatrooms = yield chatRoomModel_1.default.find({ members: { $in: [userId] } });
            const membersId = chatrooms.map((chatroom) => chatroom.members.filter((memberId) => memberId !== userId)[0]);
            const users = yield userModel_1.default.find({
                $and: [
                    { username: { $regex: usernameStartsWithRegEx } },
                    { _id: { $in: membersId } },
                ],
            }).sort({ username: 1 });
            const usersData = users.map((user) => {
                var _a;
                return {
                    _id: user._id.toString(),
                    username: user.username,
                    email: user.email,
                    friends: user.friends,
                    profilePhotoAddress: (_a = user.profilePhoto) === null || _a === void 0 ? void 0 : _a.fileAddress,
                };
            });
            res.status(200).json({
                status: true,
                data: usersData,
            });
        }
        catch (err) {
            res.status(500).json({
                status: false,
                data: "failed. err = " + err,
            });
        }
    }),
    getChatRoomMembers: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { chatRoomId } = req.params;
        try {
            const chatRoom = yield chatRoomModel_1.default.findOne({ _id: chatRoomId });
            if (chatRoom) {
                res.status(200).json({
                    status: "success",
                    message: chatRoom.members,
                });
            }
            else {
                res.status(404).json({
                    status: "fail",
                    message: "not found",
                });
            }
        }
        catch (err) {
            res.status(500).json({
                status: "fail",
                message: `error = ${err}`,
            });
        }
    }),
    getChatRoomLastMessage: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { chatRoomId } = req.params;
        try {
            const chatRoom = yield chatRoomModel_1.default.findOne({ _id: chatRoomId });
            if (chatRoom) {
                res.status(200).json({
                    status: "success",
                    message: chatRoom.lastMessage,
                });
            }
            else {
                res.status(404).json({
                    status: "fail",
                    message: "not found",
                });
            }
        }
        catch (err) {
            res.status(500).json({
                status: "fail",
                message: `error = ${err}`,
            });
        }
    }),
    deleteChatRoom: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { chatroomId } = req.params;
        try {
            yield chatRoomModel_1.default.findByIdAndDelete(chatroomId);
            const messages = yield messageModel_1.default.find({ chatRoomId: chatroomId });
            messages.forEach((message) => __awaiter(void 0, void 0, void 0, function* () { return yield messageModel_1.default.findByIdAndDelete(message._id.toString()); }));
        }
        catch (err) {
            res.status(500).json({
                status: false,
                message: "something went wrong in deleting chatroom",
            });
        }
        res.status(200).json({
            status: true,
            message: "chatroom deleted successfully.",
        });
    }),
};
