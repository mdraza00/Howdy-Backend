import { Schema, model } from "mongoose";
interface iMessage {
  chatRoomId: string;
  senderId: string;
  text: string;
  visibleTo: string[];
}
const messageSchema = new Schema<iMessage>(
  {
    chatRoomId: String,
    senderId: String,
    text: String,
    visibleTo: Array,
  },
  { timestamps: true }
);

const Message = model<iMessage>("Message", messageSchema);
export default Message;
