import { Schema, model } from "mongoose";
import { CHATROOM_TYPE } from "../enum/chatroomType";
interface iChatRoom {
  chatroomType: CHATROOM_TYPE;
  members: string[];
  chatroomProfilePhoto: string;
  groupDescription: string;
  about: string;
  chatroomName: string;
  lastMessage: string;
  lastMessageDate: string;
  lastMessageVisibleTo: string[];
}
const chatRoomSchema = new Schema<iChatRoom>(
  {
    chatroomType: { type: String, default: CHATROOM_TYPE.PRIVATE },
    members: { type: [String], required: true },
    chatroomProfilePhoto: { type: String, default: "" },
    groupDescription: { type: String, default: "" },
    chatroomName: { type: "String", default: "" },
    lastMessage: { type: String, default: "" },
    lastMessageVisibleTo: { type: [String] },
    lastMessageDate: { type: String, default: "" },
    about: { type: String, default: "" },
  },
  { timestamps: true }
);
const ChatRoom = model<iChatRoom>("ChatRoom", chatRoomSchema);

export default ChatRoom;
