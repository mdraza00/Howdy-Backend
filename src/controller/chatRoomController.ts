import { Request, Response } from "express";
import ChatRoom from "../model/chatRoomModel";
import Message from "../model/messageModel";
import User from "../model/userModel";
export default {
  createOrGetChatRoom: async (req: Request, res: Response) => {
    const { senderId, recipientId } = req.body;
    try {
      let chatRoom = await ChatRoom.findOne({
        members: { $all: [senderId, recipientId] },
      });
      if (!chatRoom) {
        chatRoom = await ChatRoom.create({ members: [senderId, recipientId] });
      }
      res.status(200).json({
        status: true,
        message: chatRoom._id,
      });
    } catch (err) {
      res.status(500).json({
        status: false,
        message: err,
      });
    }
  },
  getChatRooms: async (req: Request, res: Response) => {
    const { currentUserId } = req.body;
    try {
      const chatRooms = await ChatRoom.find({
        members: { $in: [currentUserId] },
      });

      if (chatRooms) {
        res.status(200).json({
          status: true,
          data: chatRooms,
        });
      } else {
        res.status(404).json({
          status: false,
          data: null,
        });
      }
    } catch (err) {
      res.status(500).json({
        status: "fail",
        message: `error = ${err}`,
      });
    }
  },
  getMyChatRoomMembers: async (req: Request, res: Response) => {
    const { userId } = req.params;
    try {
      const chatrooms = await ChatRoom.find({ members: { $in: [userId] } });

      const usersId = chatrooms.map(
        (chatroom) => chatroom.members.filter((id) => id !== userId)[0]
      );

      const users = await User.find({ _id: { $in: usersId } });
      const usersData = users.map((user) => {
        return {
          _id: user._id.toString(),
          email: user.email,
          username: user.username,
          profilePhotoAddress: user.profilePhoto?.fileAddress,
        };
      });
      res.status(200).json({
        status: true,
        message: usersData,
      });
    } catch (err) {
      res.status(500).json({
        status: "fail",
        message: `error = ${err}`,
      });
    }
  },
  getChatRoomMembersByName: async (req: Request, res: Response) => {
    const { userId, username } = req.params;
    const usernameStartsWithRegEx = new RegExp(`^${username}`, "i");

    try {
      const chatrooms = await ChatRoom.find({ members: { $in: [userId] } });

      const membersId = chatrooms.map(
        (chatroom) =>
          chatroom.members.filter((memberId) => memberId !== userId)[0]
      );

      const users = await User.find({
        $and: [
          { username: { $regex: usernameStartsWithRegEx } },
          { _id: { $in: membersId } },
        ],
      }).sort({ username: 1 });

      const usersData = users.map((user) => {
        return {
          _id: user._id.toString(),
          email: user.email,
          username: user.username,
          profilePhotoAddress: user.profilePhoto?.fileAddress,
        };
      });
      res.status(200).json({
        status: true,
        message: usersData,
      });
    } catch (err) {
      res.status(500).json({
        status: false,
        message: "failed. err = " + err,
      });
    }
  },
  getChatRoomMembers: async (req: Request, res: Response) => {
    const { chatRoomId } = req.params;
    try {
      const chatRoom = await ChatRoom.findOne({ _id: chatRoomId });
      if (chatRoom) {
        res.status(200).json({
          status: "success",
          message: chatRoom.members,
        });
      } else {
        res.status(404).json({
          status: "fail",
          message: "not found",
        });
      }
    } catch (err) {
      res.status(500).json({
        status: "fail",
        message: `error = ${err}`,
      });
    }
  },
  getChatRoomLastMessage: async (req: Request, res: Response) => {
    const { chatRoomId } = req.params;
    try {
      const chatRoom = await ChatRoom.findOne({ _id: chatRoomId });
      if (chatRoom) {
        res.status(200).json({
          status: "success",
          message: chatRoom.lastMessage,
        });
      } else {
        res.status(404).json({
          status: "fail",
          message: "not found",
        });
      }
    } catch (err) {
      res.status(500).json({
        status: "fail",
        message: `error = ${err}`,
      });
    }
  },
  deleteChatRoom: async (req: Request, res: Response) => {
    const { chatroomId } = req.params;

    try {
      await ChatRoom.findByIdAndDelete(chatroomId);

      const messages = await Message.find({ chatRoomId: chatroomId });

      messages.forEach(
        async (message) =>
          await Message.findByIdAndDelete(message._id.toString())
      );
    } catch (err) {
      res.status(500).json({
        status: false,
        message: "something went wrong in deleting chatroom",
      });
    }

    res.status(200).json({
      status: true,
      message: "chatroom deleted successfully.",
    });
  },
};
