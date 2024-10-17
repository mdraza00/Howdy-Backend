"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const multer_1 = __importDefault(require("multer"));
const express_1 = require("express");
const chatRoomController_1 = __importDefault(require("../controller/chatRoomController"));
const authenticateUser_1 = __importDefault(require("../controller/authenticateUser"));
const chatRoomRouter = (0, express_1.Router)();
const upload = (0, multer_1.default)({
    storage: multer_1.default.diskStorage({
        destination: (req, file, cb) => {
            return cb(null, "public/uploads/group-profile-picture");
        },
        filename: (req, file, cb) => {
            return cb(null, `${Date.now()}--${file.originalname}`);
        },
    }),
});
chatRoomRouter.post("/createRoom", authenticateUser_1.default.authUserMiddleware, chatRoomController_1.default.createOrGetChatRoom);
chatRoomRouter.post("/create-group-chat", authenticateUser_1.default.authUserMiddleware, upload.single("group-profile-picture"), chatRoomController_1.default.createGroup);
chatRoomRouter.post("/get/ChatRooms", authenticateUser_1.default.authUserMiddleware, chatRoomController_1.default.getChatRooms);
chatRoomRouter.get("/get/lastMessage/:chatRoomId", authenticateUser_1.default.authUserMiddleware, chatRoomController_1.default.getChatRoomLastMessage);
chatRoomRouter.get("/get-my-chatroom-members/:userId", authenticateUser_1.default.authUserMiddleware, chatRoomController_1.default.getMyChatRoomMembers);
chatRoomRouter.get("/get-my-chatroom-members-by-name/:userId/:username", authenticateUser_1.default.authUserMiddleware, chatRoomController_1.default.getChatRoomMembersByName);
chatRoomRouter.get("/get/chatRoomMembers/:chatRoomId", authenticateUser_1.default.authUserMiddleware, chatRoomController_1.default.getChatRoomMembers);
chatRoomRouter.delete("/delete/:chatroomId", authenticateUser_1.default.authUserMiddleware, chatRoomController_1.default.deleteChatRoom);
exports.default = chatRoomRouter;
