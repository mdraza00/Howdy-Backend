"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const messageController_1 = __importDefault(require("../controller/messageController"));
const authenticateUser_1 = __importDefault(require("../controller/authenticateUser"));
const messageRouter = (0, express_1.Router)();
const imageUpload = (0, multer_1.default)({
    storage: multer_1.default.diskStorage({
        destination: (req, file, cb) => {
            return cb(null, "public/uploads/multimedia-messages");
        },
        filename: (req, file, cb) => {
            return cb(null, `${Date.now()}--${file.originalname}`);
        },
    }),
});
messageRouter.post("/save", authenticateUser_1.default.authUserMiddleware, messageController_1.default.saveMessage);
messageRouter.post("/save/multimedia", authenticateUser_1.default.authUserMiddleware, imageUpload.single("multimedia"), messageController_1.default.saveMultimediaMessage);
messageRouter.get("/get/:roomId", authenticateUser_1.default.authUserMiddleware, messageController_1.default.getRoomMessages);
messageRouter.patch("/clear-messages", authenticateUser_1.default.authUserMiddleware, messageController_1.default.ClearChatRoomMessages);
messageRouter.delete("/delete-for-me/:userId/:chatroomId/:messages", authenticateUser_1.default.authUserMiddleware, messageController_1.default.deleteForMe);
messageRouter.delete("/delete-for-everyone/:userId/:chatroomId/:messages", authenticateUser_1.default.authUserMiddleware, messageController_1.default.deleteForEveryOne);
exports.default = messageRouter;
