import { Request, Response } from "express";
import Message from "../model/messageModel";
import ChatRoom from "../model/chatRoomModel";

export default {
  saveMessage: async (req: Request, res: Response) => {
    const { chatRoomId, senderId, text } = req.body;
    const updatedChatRoom = await ChatRoom.findOneAndUpdate(
      { _id: chatRoomId },
      { lastMessage: text, lastMessageDate: new Date().toString() }
    );
    const chatRoomMembers = updatedChatRoom
      ? updatedChatRoom.members
      : ["", ""];
    const message = await Message.create({
      chatRoomId,
      senderId,
      text,
      visibleTo: chatRoomMembers,
    });

    res.status(200).json({
      status: "success",
      message: "data is stored",
    });
  },

  getRoomMessages: async (req: Request, res: Response) => {
    const { roomId } = req.params;
    try {
      const messages = await Message.find({ chatRoomId: roomId }).sort({
        createdAt: 1,
      });
      res.status(200).json({ status: true, data: messages });
    } catch (err) {
      res.json(500).json({
        status: false,
        message: "some error has occured",
      });
    }
  },

  ClearChatRoomMessages: async (req: Request, res: Response) => {
    const { chatroomId, userId } = req.body;
    try {
      const messages = await Message.find({ chatRoomId: chatroomId });
      messages.forEach(async (message) => {
        const visibleTo = message.visibleTo.filter(
          (visibleToMember) => visibleToMember !== userId
        );
        await Message.findByIdAndUpdate(message._id.toString(), { visibleTo });
      });

      res.status(200).json({
        status: true,
        message: "messages cleared successfully",
      });
    } catch (err) {
      res.status(500).json({
        status: false,
        message: "error in clearing messages",
      });
    }
  },
  deleteSelectedMessages: async (req: Request, res: Response) => {
    try {
      const { ids } = req.params;
      const messagesIdArray = ids.split("--");
      messagesIdArray.forEach(
        async (messageId) => await Message.findByIdAndDelete(messageId)
      );
      res.status(200).json({
        status: true,
        message: "messages deleted successfully",
      });
    } catch (err) {
      res.status(500).json({
        status: false,
        message: "failed to delete selected messages",
      });
    }
  },
};