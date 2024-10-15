"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const friendRequest_model_1 = __importDefault(require("../model/friendRequest.model"));
const friendRequest_service_1 = __importDefault(require("../services/friendRequest.service"));
const friend_request_1 = require("../enum/friend_request");
exports.default = {
    getFriendRequests: function (req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { userId } = req.params;
            const requests = yield friendRequest_service_1.default.getFriendRequests(userId);
            res.status(200).json({
                status: true,
                message: requests,
            });
        });
    },
    sendFriendRequest: function (req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { requestedUserId, senderId } = req.body;
            try {
                if (requestedUserId && senderId) {
                    try {
                        const request = yield friendRequest_model_1.default.findOne({
                            request_to: senderId,
                            request_by: requestedUserId,
                        });
                        if (request) {
                            friendRequest_service_1.default.updateRequestStatus(request.id, friend_request_1.REQUEST_STATUS.ACCEPTED);
                        }
                        else {
                            yield friendRequest_model_1.default.create({
                                request_to: requestedUserId,
                                request_by: senderId,
                            });
                        }
                        res.status(200).json({
                            status: true,
                            message: "Friend request sent successfully.",
                        });
                    }
                    catch (err) {
                        res.status(500).json({
                            status: false,
                            message: `error occurred in send friend request. error = ${err}`,
                        });
                    }
                }
                else {
                    res.status(400).json({
                        status: false,
                        message: "Request parameters missing",
                    });
                }
            }
            catch (err) {
                res.status(500).json({
                    status: false,
                    message: "Something went wrong",
                });
            }
        });
    },
    updateRequestStatus: function (req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { messageId, requestStatus } = req.body;
            try {
                friendRequest_service_1.default.updateRequestStatus(messageId, requestStatus);
                res.status(200).json({
                    status: true,
                    message: `request has successfully ${requestStatus}`,
                });
            }
            catch (err) {
                res.status(500).json({
                    status: false,
                    message: `error occurred. ${err}`,
                });
            }
        });
    },
};
