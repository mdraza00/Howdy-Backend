import { Schema, model } from "mongoose";
interface iMessage {
  chatRoomId: string;
  senderId: string;
  text: string;
  visibleTo: string[];
  deletedFor: string[];
  deleteForEveryOne: number;
}
const messageSchema = new Schema<iMessage>(
  {
    chatRoomId: String,
    senderId: String,
    text: String,
    visibleTo: [String],
    deletedFor: [String],
    deleteForEveryOne: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Message = model<iMessage>("Message", messageSchema);
export default Message;
