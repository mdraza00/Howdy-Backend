import { Request, Response } from "express";
import Message from "../model/messageModel";
import ChatRoom from "../model/chatRoomModel";
import { MessageType } from "../enum/message";

export default {
  saveMessage: async (req: Request, res: Response) => {
    try {
      const { chatRoomId, senderId, text, messageType } = req.body;
      if (messageType === MessageType.TEXT) {
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
          chatRoomId: chatRoomId,
          senderId: senderId,
          messageType: MessageType.TEXT,
          text: text,
          image: null,
          video: null,
          visibleTo: chatRoomMembers,
          deletedFor: [],
          deleteForEveryOne: 0,
        });

        res.status(200).json({
          status: true,
          message: message,
        });
      }
    } catch (err) {
      res.status(500).json({
        status: false,
        message: null,
      });
    }
  },
  saveMultimediaMessage: async (req: Request, res: Response) => {
    try {
      const { chatRoomId, senderId, messageType, caption } = req.body;
      const file = req.file;

      if (messageType === MessageType.IMAGE) {
        const chatroom = await ChatRoom.findOne({ _id: chatRoomId });

        const updatedChatRoom = await ChatRoom.findOneAndUpdate(
          { _id: chatRoomId },
          {
            lastMessage: MessageType.IMAGE,
            lastMessageDate: new Date().toString(),
            lastMessageVisibleTo: chatroom?.members,
          }
        );

        const chatRoomMembers = updatedChatRoom
          ? updatedChatRoom.members
          : ["", ""];

        const message = await Message.create({
          chatRoomId: chatRoomId,
          senderId: senderId,
          messageType: MessageType.IMAGE,
          text: MessageType.IMAGE,
          image: {
            name: file?.filename,
            caption: caption,
            address: file?.destination.slice(7),
          },
          video: null,
          doc: null,
          visibleTo: chatRoomMembers,
          deletedFor: [],
          deleteForEveryOne: 0,
        });

        res.status(200).json({
          status: true,
          message: message,
        });
      } else if (messageType === MessageType.VIDEO) {
        const chatroom = await ChatRoom.findOne({ _id: chatRoomId });

        const updatedChatRoom = await ChatRoom.findOneAndUpdate(
          { _id: chatRoomId },
          {
            lastMessage: MessageType.VIDEO,
            lastMessageDate: new Date().toString(),
            lastMessageVisibleTo: chatroom?.members,
          }
        );

        const chatRoomMembers = updatedChatRoom
          ? updatedChatRoom.members
          : ["", ""];

        const message = await Message.create({
          chatRoomId: chatRoomId,
          senderId: senderId,
          messageType: MessageType.VIDEO,
          text: MessageType.VIDEO,
          image: null,
          video: {
            name: file?.filename,
            caption: caption,
            address: file?.destination.slice(7),
          },
          doc: null,
          visibleTo: chatRoomMembers,
          deletedFor: [],
          deleteForEveryOne: 0,
        });

        res.status(200).json({
          status: true,
          message: message,
        });
      } else if (messageType === MessageType.DOC) {
        const chatroom = await ChatRoom.findOne({ _id: chatRoomId });

        const updatedChatRoom = await ChatRoom.findOneAndUpdate(
          { _id: chatRoomId },
          {
            lastMessage: MessageType.DOC,
            lastMessageDate: new Date().toString(),
            lastMessageVisibleTo: chatroom?.members,
          }
        );

        const chatRoomMembers = updatedChatRoom
          ? updatedChatRoom.members
          : ["", ""];

        const message = await Message.create({
          chatRoomId: chatRoomId,
          senderId: senderId,
          messageType: MessageType.DOC,
          text: MessageType.DOC,
          image: null,
          video: null,
          doc: {
            name: file?.filename,
            caption: caption,
            address: file?.destination.slice(7),
          },
          visibleTo: chatRoomMembers,
          deletedFor: [],
          deleteForEveryOne: 0,
        });

        res.status(200).json({
          status: true,
          message: message,
        });
      }
    } catch (error) {
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
      if (messages.length === 0) {
        res.status(200).json({ status: true, data: [] });
      } else {
        const updatedMessages = messages.map((message) => {
          return message.deleteForEveryOne == 0
            ? message
            : { ...message.toObject(), text: "message has been deleted" };
        });

        await ChatRoom.findOneAndUpdate(
          { _id: roomId },
          {
            lastMessage: updatedMessages[updatedMessages.length - 1].text,
          }
        );

        res.status(200).json({ status: true, data: updatedMessages });
      }
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
        const visibleTo =
          message &&
          message.visibleTo.filter((visibleToId) => visibleToId != userId);
        await Message.findOneAndUpdate(
          { _id: messageId },
          { deletedFor: [...deletedFor, userId], visibleTo }
        );
      });

      res.status(200).json({
        status: true,
        data: "messages deleted for you successfully",
      });
    } catch (err) {
      res.status(500).json({
        status: false,
        data: "error in deleted messages for you",
      });
    }
  },
  deleteForEveryOne: async function (req: Request, res: Response) {
    try {
      const { messages, chatroomId } = req.params;
      const messagesId = messages
        .split("__")
        .map((message) => message.split("--")[0]);

      messagesId.forEach(async (messageId) => {
        await Message.findOneAndUpdate(
          { _id: messageId },
          {
            deleteForEveryOne: 1,
            messageType: MessageType.TEXT,
          }
        );
      });

      const updatedMessages = await Message.find({
        chatRoomId: chatroomId,
      }).sort({
        createdAt: 1,
      });

      res.status(200).json({
        status: true,
        message: "message deleted successfully",
      });
    } catch (err) {
      res.status(500).json({
        status: false,
        message: [],
      });
    }
  },
};
