import { Schema, model } from "mongoose";
interface iChatRoom {
  members: string[];
  lastMessage: string;
  lastMessageDate: string;
}
const chatRoomSchema = new Schema<iChatRoom>(
  {
    members: Array,
    lastMessage: { type: String, default: "" },
    lastMessageDate: { type: String, default: "" },
  },
  { timestamps: true }
);
const ChatRoom = model<iChatRoom>("ChatRoom", chatRoomSchema);

export default ChatRoom;
