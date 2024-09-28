import { Router } from "express";
import messageController from "../controller/messageController";
import authenticateUser from "../controller/authenticateUser";
const messageRouter = Router();

messageRouter.post(
  "/save",
  authenticateUser.authUserMiddleware,
  messageController.saveMessage
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
  "/delete/selected-messages/:ids",
  authenticateUser.authUserMiddleware,
  messageController.deleteSelectedMessages
);
export default messageRouter;
