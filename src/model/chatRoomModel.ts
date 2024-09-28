import { Schema, model } from "mongoose";
interface iChatRoom {
  members: string[];
  lastMessage: string;
  lastMessageDate: string;
  lastMessageVisibleTo: string[];
}
const chatRoomSchema = new Schema<iChatRoom>(
  {
    members: { type: [String], required: true },
    lastMessage: { type: String, default: "" },
    lastMessageVisibleTo: { type: [String] },
    lastMessageDate: { type: String, default: "" },
  },
  { timestamps: true }
);
const ChatRoom = model<iChatRoom>("ChatRoom", chatRoomSchema);

export default ChatRoom;
