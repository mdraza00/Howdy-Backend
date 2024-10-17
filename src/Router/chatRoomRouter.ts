import multer from "multer";
import { Router } from "express";
import chatRoomController from "../controller/chatRoomController";
import authenticateUser from "../controller/authenticateUser";
const chatRoomRouter = Router();

const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      return cb(null, "public/uploads/group-profile-picture");
    },
    filename: (req, file, cb) => {
      return cb(null, `${Date.now()}--${file.originalname}`);
    },
  }),
});

chatRoomRouter.post(
  "/createRoom",
  authenticateUser.authUserMiddleware,
  chatRoomController.createOrGetChatRoom
);

chatRoomRouter.post(
  "/create-group-chat",
  authenticateUser.authUserMiddleware,
  upload.single("group-profile-picture"),
  chatRoomController.createGroup
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
  "/get-my-chatroom-members/:userId",
  authenticateUser.authUserMiddleware,
  chatRoomController.getMyChatRoomMembers
);
chatRoomRouter.get(
  "/get-my-chatroom-members-by-name/:userId/:username",
  authenticateUser.authUserMiddleware,
  chatRoomController.getChatRoomMembersByName
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
