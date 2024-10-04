import { Router } from "express";

import { imageUpload } from "../multer";
import messageController from "../controller/messageController";
import authenticateUser from "../controller/authenticateUser";
const messageRouter = Router();

messageRouter.post(
  "/save",
  authenticateUser.authUserMiddleware,
  messageController.saveMessage
);
messageRouter.post(
  "/save/multimedia",
  authenticateUser.authUserMiddleware,
  imageUpload.single("multimedia"),
  messageController.saveMultimediaMessage
);
messageRouter.get(
  "/get/:roomId",
  authenticateUser.authUserMiddleware,
  messageController.getRoomMessages
);
messageRouter.patch(
  "/clear-messages",
  authenticateUser.authUserMiddleware,
  messageController.ClearChatRoomMessages
);
messageRouter.delete(
  "/delete-for-me/:userId/:chatroomId/:messages",
  authenticateUser.authUserMiddleware,
  messageController.deleteForMe
);
messageRouter.delete(
  "/delete-for-everyone/:userId/:chatroomId/:messages",
  authenticateUser.authUserMiddleware,
  messageController.deleteForEveryOne
);
export default messageRouter;
