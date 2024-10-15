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
const friend_request_1 = require("../enum/friend_request");
const friendRequest_model_1 = __importDefault(require("../model/friendRequest.model"));
const userModel_1 = __importDefault(require("../model/userModel"));
exports.default = {
    updateRequestStatus: function (messageId, requestStatus) {
        return __awaiter(this, void 0, void 0, function* () {
            const request = yield friendRequest_model_1.default.findById(messageId);
            if (requestStatus == friend_request_1.REQUEST_STATUS.ACCEPTED) {
                // request is accepted
                yield userModel_1.default.findByIdAndUpdate(request === null || request === void 0 ? void 0 : request.request_by, {
                    $push: { friends: request === null || request === void 0 ? void 0 : request.request_to },
                });
                yield userModel_1.default.findByIdAndUpdate(request === null || request === void 0 ? void 0 : request.request_to, {
                    $push: { friends: request === null || request === void 0 ? void 0 : request.request_by },
                });
                yield friendRequest_model_1.default.findByIdAndDelete(messageId);
            }
            else if (requestStatus == friend_request_1.REQUEST_STATUS.REJECTED) {
                yield friendRequest_model_1.default.findByIdAndDelete(request === null || request === void 0 ? void 0 : request._id);
            }
        });
    },
    getFriendRequests: function (userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const requests = yield friendRequest_model_1.default.find({
                request_to: userId,
            }).populate("request_by", "_id username profilePhoto.fileAddress");
            return requests;
        });
    },
};
