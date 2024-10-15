import mongoose, { model, Schema } from "mongoose";
import { REQUEST_STATUS } from "../enum/friend_request";

interface friendRequest {
  request_to: mongoose.Schema.Types.ObjectId;
  request_by: mongoose.Schema.Types.ObjectId;
  request_status: REQUEST_STATUS;
}

const Friend_Request_Schema = new Schema<friendRequest>({
  request_to: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  request_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  request_status: { type: String, default: REQUEST_STATUS.PENDING },
});

const Friend_Request = model<friendRequest>(
  "Friend_Request",
  Friend_Request_Schema
);
export default Friend_Request;
