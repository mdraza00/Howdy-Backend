import { Request, Response } from "express";
import Friend_Request from "../model/friendRequest.model";
import friendRequestService from "../services/friendRequest.service";
import { REQUEST_STATUS } from "../enum/friend_request";
export default {
  getFriendRequests: async function (req: Request, res: Response) {
    const { userId } = req.params;
    const requests = await friendRequestService.getFriendRequests(userId);
    res.status(200).json({
      status: true,
      message: requests,
    });
  },
  sendFriendRequest: async function (req: Request, res: Response) {
    const { requestedUserId, senderId } = req.body;
    try {
      if (requestedUserId && senderId) {
        try {
          const request = await Friend_Request.findOne({
            request_to: senderId,
            request_by: requestedUserId,
          });
          if (request) {
            friendRequestService.updateRequestStatus(
              request.id,
              REQUEST_STATUS.ACCEPTED
            );
          } else {
            await Friend_Request.create({
              request_to: requestedUserId,
              request_by: senderId,
            });
          }
          res.status(200).json({
            status: true,
            message: "Friend request sent successfully.",
          });
        } catch (err) {
          res.status(500).json({
            status: false,
            message: `error occurred in send friend request. error = ${err}`,
          });
        }
      } else {
        res.status(400).json({
          status: false,
          message: "Request parameters missing",
        });
      }
    } catch (err) {
      res.status(500).json({
        status: false,
        message: "Something went wrong",
      });
    }
  },
  updateRequestStatus: async function (req: Request, res: Response) {
    const { messageId, requestStatus } = req.body;
    try {
      friendRequestService.updateRequestStatus(messageId, requestStatus);
      res.status(200).json({
        status: true,
        message: `request has successfully ${requestStatus}`,
      });
    } catch (err) {
      res.status(500).json({
        status: false,
        message: `error occurred. ${err}`,
      });
    }
  },
};
