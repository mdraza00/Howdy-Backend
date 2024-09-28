"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const messageController_1 = __importDefault(require("../controller/messageController"));
const authenticateUser_1 = __importDefault(require("../controller/authenticateUser"));
const messageRouter = (0, express_1.Router)();
messageRouter.post("/save", authenticateUser_1.default.authUserMiddleware, messageController_1.default.saveMessage);
messageRouter.get("/get/:roomId", authenticateUser_1.default.authUserMiddleware, messageController_1.default.getRoomMessages);
messageRouter.patch("/clear-messages", authenticateUser_1.default.authUserMiddleware, messageController_1.default.ClearChatRoomMessages);
messageRouter.delete("/delete-for-me/:userId/:chatroomId/:messages", authenticateUser_1.default.authUserMiddleware, messageController_1.default.deleteForMe);
messageRouter.delete("/delete-for-everyone/:userId/:chatroomId/:messages", authenticateUser_1.default.authUserMiddleware, messageController_1.default.deleteForEveryOne);
exports.default = messageRouter;
