"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const friendRequest_controller_1 = __importDefault(require("../controller/friendRequest.controller"));
const authenticateUser_1 = __importDefault(require("../controller/authenticateUser"));
const friendRequestRouter = (0, express_1.Router)();
friendRequestRouter.get("/:userId", authenticateUser_1.default.authUserMiddleware, friendRequest_controller_1.default.getFriendRequests);
friendRequestRouter.post("/", authenticateUser_1.default.authUserMiddleware, friendRequest_controller_1.default.sendFriendRequest);
friendRequestRouter.patch("/", authenticateUser_1.default.authUserMiddleware, friendRequest_controller_1.default.updateRequestStatus);
exports.default = friendRequestRouter;
