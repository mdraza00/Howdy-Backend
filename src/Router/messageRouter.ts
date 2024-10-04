const imageExtentions = ["jpg", "jpeg", "png", "gif"];
const documentExtentions = ["pdf", "ppt", "docx", "text"];
const videoExtentions = ["mp4", "mkv"];
const musicExtentions = ["mp3"];

import { Router } from "express";
import multer from "multer";
import messageController from "../controller/messageController";
import authenticateUser from "../controller/authenticateUser";
const messageRouter = Router();

const imageUpload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      const fileExtention =
        file.originalname.split(".")[file.originalname.split(".").length - 1];
      if (documentExtentions.includes(fileExtention))
        return cb(null, "public/uploads/multimedia-messages/Documents");
      else if (imageExtentions.includes(fileExtention))
        return cb(null, "public/uploads/multimedia-messages/Images");
      else if (musicExtentions.includes(fileExtention))
        return cb(null, "public/uploads/multimedia-messages/Music");
      else if (videoExtentions.includes(fileExtention))
        return cb(null, "public/uploads/multimedia-messages/Videos");
      else return cb(null, "public/uploads/multimedia-messages/Others");
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
