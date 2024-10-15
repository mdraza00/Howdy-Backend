import { Router } from "express";
import friendRequestController from "../controller/friendRequest.controller";
import authenticateUser from "../controller/authenticateUser";
const friendRequestRouter = Router();
friendRequestRouter.get(
  "/:userId",
  authenticateUser.authUserMiddleware,
  friendRequestController.getFriendRequests
);
friendRequestRouter.post(
  "/",
  authenticateUser.authUserMiddleware,
  friendRequestController.sendFriendRequest
);
friendRequestRouter.patch(
  "/",
  authenticateUser.authUserMiddleware,
  friendRequestController.updateRequestStatus
);
export default friendRequestRouter;
