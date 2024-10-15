import mongoose from "mongoose";
import { REQUEST_STATUS } from "../enum/friend_request";
import Friend_Request from "../model/friendRequest.model";
import User from "../model/userModel";

export default {
  updateRequestStatus: async function (
    messageId: mongoose.Schema.Types.ObjectId,
    requestStatus: REQUEST_STATUS
  ) {
    const request = await Friend_Request.findById(messageId);

    if (requestStatus == REQUEST_STATUS.ACCEPTED) {
      // request is accepted
      await User.findByIdAndUpdate(request?.request_by, {
        $push: { friends: request?.request_to },
      });
      await User.findByIdAndUpdate(request?.request_to, {
        $push: { friends: request?.request_by },
      });
      await Friend_Request.findByIdAndDelete(messageId);
    } else if (requestStatus == REQUEST_STATUS.REJECTED) {
      await Friend_Request.findByIdAndDelete(request?._id);
    }
  },
  getFriendRequests: async function (userId: string) {
    const requests = await Friend_Request.find({
      request_to: userId,
    }).populate("request_by", "_id username profilePhoto.fileAddress");
    return requests;
  },
};
