import { Router } from "express";
import multer from "multer";
import messageController from "../controller/messageController";
import authenticateUser from "../controller/authenticateUser";
const messageRouter = Router();

const imageUpload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      return cb(null, "public/uploads/multimedia-messages");
    },
    filename: (req, file, cb) => {
      return cb(null, `${Date.now()}--${file.originalname}`);
    },
  }),
});

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
