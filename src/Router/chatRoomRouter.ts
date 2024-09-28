import { NextFunction, Request, Response, Router } from "express";
import chatRoomController from "../controller/chatRoomController";
import authenticateUser from "../controller/authenticateUser";
const chatRoomRouter = Router();

chatRoomRouter.post(
  "/createRoom",
  authenticateUser.authUserMiddleware,
  chatRoomController.createChatRoom
);

chatRoomRouter.post(
  "/get/ChatRooms",
  authenticateUser.authUserMiddleware,
  chatRoomController.getChatRooms
);

chatRoomRouter.get(
  "/get/lastMessage/:chatRoomId",
  authenticateUser.authUserMiddleware,
  chatRoomController.getChatRoomLastMessage
);

chatRoomRouter.get(
  "/get/chatRoomMembers/:chatRoomId",
  authenticateUser.authUserMiddleware,
  chatRoomController.getChatRoomMembers
);
chatRoomRouter.delete(
  "/delete/:chatroomId",
  authenticateUser.authUserMiddleware,
  chatRoomController.deleteChatRoom
);

export default chatRoomRouter;
