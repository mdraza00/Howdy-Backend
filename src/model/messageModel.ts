import { Schema, model } from "mongoose";
import { MessageType } from "../enum/message";

const messageSchema = new Schema(
  {
    chatRoomId: String,
    senderId: String,
    messageType: {
      type: String,
      enum: MessageType,
      default: "text",
    },
    text: String,
    image: { name: String, caption: String, address: String },
    video: { name: String, caption: String, address: String },
    doc: { name: String, caption: String, address: String },
    visibleTo: [String],
    deletedFor: [String],
    deleteForEveryOne: { type: Number, default: 0 },
    replyTo: { type: String, default: undefined },
  },
  { timestamps: true }
);

const Message = model("Message", messageSchema);
export default Message;
