"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const chatRoomController_1 = __importDefault(require("../controller/chatRoomController"));
const authenticateUser_1 = __importDefault(require("../controller/authenticateUser"));
const chatRoomRouter = (0, express_1.Router)();
chatRoomRouter.post("/createRoom", authenticateUser_1.default.authUserMiddleware, chatRoomController_1.default.createOrGetChatRoom);
chatRoomRouter.post("/get/ChatRooms", authenticateUser_1.default.authUserMiddleware, chatRoomController_1.default.getChatRooms);
chatRoomRouter.get("/get/lastMessage/:chatRoomId", authenticateUser_1.default.authUserMiddleware, chatRoomController_1.default.getChatRoomLastMessage);
chatRoomRouter.get("/get-my-chatroom-members/:userId", authenticateUser_1.default.authUserMiddleware, chatRoomController_1.default.getMyChatRoomMembers);
chatRoomRouter.get("/get-my-chatroom-members-by-name/:userId/:username", authenticateUser_1.default.authUserMiddleware, chatRoomController_1.default.getChatRoomMembersByName);
chatRoomRouter.get("/get/chatRoomMembers/:chatRoomId", authenticateUser_1.default.authUserMiddleware, chatRoomController_1.default.getChatRoomMembers);
chatRoomRouter.delete("/delete/:chatroomId", authenticateUser_1.default.authUserMiddleware, chatRoomController_1.default.deleteChatRoom);
exports.default = chatRoomRouter;
