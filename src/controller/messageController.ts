import { Request, Response } from "express";
import Message from "../model/messageModel";
import ChatRoom from "../model/chatRoomModel";

export default {
  saveMessage: async (req: Request, res: Response) => {
    try {
      const { chatRoomId, senderId, text } = req.body;

      const chatroom = await ChatRoom.findOne({ _id: chatRoomId });
      const updatedChatRoom = await ChatRoom.findOneAndUpdate(
        { _id: chatRoomId },
        {
          lastMessage: text,
          lastMessageDate: new Date().toString(),
          lastMessageVisibleTo: chatroom?.members,
        }
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
        status: true,
        message: message,
      });
    } catch (err) {
      res.status(500).json({
        status: false,
        message: null,
      });
    }
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
      const chatroom = await ChatRoom.findOne({ _id: chatroomId });
      const messages = await Message.find({ chatRoomId: chatroomId });

      messages.forEach(async (message) => {
        const visibleTo = message.visibleTo.filter(
          (visibleToMember) => visibleToMember !== userId
        );
        await Message.findByIdAndUpdate(message._id.toString(), { visibleTo });
      });

      const updatedMessages = await Message.find({ chatRoomId: chatroomId });

      const visibleTo = chatroom?.lastMessageVisibleTo.filter(
        (visibleToMember) => visibleToMember !== userId
      );
      await ChatRoom.findByIdAndUpdate(chatroomId, {
        lastMessageVisibleTo: visibleTo,
      });

      res.status(200).json({
        status: true,
        data: updatedMessages,
      });
    } catch (err) {
      res.status(500).json({
        status: false,
        data: {},
      });
    }
  },
  deleteForMe: async function (req: Request, res: Response) {
    try {
      const { messages, userId, chatroomId } = req.params;
      const messagesId = messages
        .split("__")
        .map((message) => message.split("--")[0]);

      messagesId.forEach(async (messageId) => {
        const message = await Message.findById(messageId);
        const deletedFor =
          message && message.deletedFor ? message.deletedFor : [];
        await Message.findOneAndUpdate(
          { _id: messageId },
          { deletedFor: [...deletedFor, userId] }
        );
      });

      const updatedMessages = await Message.find({ chatRoomId: chatroomId });
      res.status(200).json({
        status: true,
        data: updatedMessages,
      });
    } catch (err) {
      res.status(500).json({
        status: false,
        data: [],
      });
    }
  },
  deleteForEveryOne: async function (req: Request, res: Response) {
    try {
      const { messages, userId, chatroomId } = req.params;
      console.log(messages);
      const messagesId = messages
        .split("__")
        .map((message) => message.split("--")[0]);

      messagesId.forEach(async (messageId) => {
        const message = await Message.findOne({ _id: messageId });
        const updatedMessage = await Message.findOneAndUpdate(
          { _id: messageId },
          {
            deleteForEveryOne: 1,
          }
        );
      });
      const updatedMessages = await Message.find({ chatRoomId: chatroomId });
      res.status(200).json({
        status: true,
        message: updatedMessages,
      });
    } catch (err) {
      res.status(500).json({
        status: false,
        message: [],
      });
    }
  },
};
