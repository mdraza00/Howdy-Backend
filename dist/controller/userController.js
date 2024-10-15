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
const userModel_1 = __importDefault(require("../model/userModel"));
const chatRoomModel_1 = __importDefault(require("../model/chatRoomModel"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const friendRequest_model_1 = __importDefault(require("../model/friendRequest.model"));
const hashPassword = function (password) {
    return __awaiter(this, void 0, void 0, function* () {
        const salt = yield bcrypt_1.default.genSalt(15);
        const hashedPassword = yield bcrypt_1.default.hash(password, salt);
        return hashedPassword;
    });
};
const userController = {
    getUser: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        const { userId } = req.body;
        try {
            const user = yield userModel_1.default.findOne({ _id: userId });
            if (user) {
                res.status(200).json({
                    status: true,
                    data: {
                        _id: user._id.toString(),
                        username: user.username,
                        email: user.email,
                        friends: user.friends,
                        profilePhotoAddress: (_a = user.profilePhoto) === null || _a === void 0 ? void 0 : _a.fileAddress,
                        about: user.about,
                    },
                });
            }
            else {
                res.status(404).json({
                    status: false,
                    data: null,
                });
            }
        }
        catch (err) {
            res.status(500).json({
                status: false,
                data: null,
            });
        }
    }),
    getUsers: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { userId } = req.params;
        try {
            const user = yield userModel_1.default.findOne({ _id: userId });
            if (user) {
                const users = yield userModel_1.default.find({
                    _id: { $nin: [...user.friends, user._id.toString()] },
                });
                const usersData = yield Promise.all(users.map((user) => __awaiter(void 0, void 0, void 0, function* () {
                    var _a;
                    const friendRequest = yield friendRequest_model_1.default.findOne({
                        request_to: user._id.toString(),
                        request_by: userId,
                    });
                    return {
                        _id: user._id.toString(),
                        username: user.username,
                        profilePhotoAddress: (_a = user.profilePhoto) === null || _a === void 0 ? void 0 : _a.fileAddress,
                        isFriendRequest: !!friendRequest,
                    };
                })));
                res.status(200).json({
                    status: true,
                    message: usersData,
                });
            }
            else {
                res.send(404).json({ status: false, message: "user not found." });
            }
        }
        catch (err) {
            res.status(500).json({
                status: "fail",
                message: `error has occurred ${err}`,
            });
        }
    }),
    getFriends: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { userId } = req.params;
        try {
            const user = yield userModel_1.default.findOne({ _id: userId });
            if (user) {
                const friends = yield userModel_1.default.find({
                    _id: { $in: user.friends },
                });
                const usersData = friends.map((friend) => {
                    var _a;
                    return {
                        _id: friend._id.toString(),
                        username: friend.username,
                        email: friend.email,
                        friends: friend.friends,
                        profilePhotoAddress: (_a = friend.profilePhoto) === null || _a === void 0 ? void 0 : _a.fileAddress,
                        about: friend.about,
                    };
                });
                res.status(200).json({
                    status: true,
                    message: usersData,
                });
            }
            else {
                res.send(404).json({ status: false, message: "user not found." });
            }
        }
        catch (err) {
            res.status(500).json({
                status: "fail",
                message: `error has occurred ${err}`,
            });
        }
    }),
    getUsersByName: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { userNametoFind, senderId } = req.body;
        const regExStr1 = new RegExp(`^${userNametoFind}`, "i");
        const regExStr2 = new RegExp(`${userNametoFind}`, "i");
        try {
            const userSender = yield userModel_1.default.findById(senderId);
            if (userSender) {
                const usersWhoseNameStartsWith = yield userModel_1.default.find({
                    $and: [
                        { username: { $regex: regExStr1 } },
                        { _id: { $nin: [...userSender.friends, senderId] } },
                    ],
                });
                const usersWhoseNameContaines = yield userModel_1.default.find({
                    $and: [
                        { username: { $regex: regExStr2 } },
                        { _id: { $nin: [...userSender.friends, senderId] } },
                    ],
                });
                const foundUsersWithDuplicates = [
                    ...usersWhoseNameStartsWith,
                    ...usersWhoseNameContaines,
                ];
                const foundUsers = [
                    ...new Set(foundUsersWithDuplicates.map((e) => JSON.stringify(e))),
                ].map((e) => JSON.parse(e));
                const filteredUsersWithNull = yield Promise.all(foundUsers.map((user) => __awaiter(void 0, void 0, void 0, function* () {
                    const chatRoom = yield chatRoomModel_1.default.findOne({
                        members: { $all: [senderId, user._id] },
                    });
                    return !chatRoom ? user : null;
                })));
                const result = filteredUsersWithNull.filter((user) => !!user);
                if (result) {
                    const users = yield Promise.all(result.map((user) => __awaiter(void 0, void 0, void 0, function* () {
                        var _a;
                        const friendRequest = yield friendRequest_model_1.default.findOne({
                            request_to: user._id.toString(),
                            request_by: senderId,
                        });
                        return {
                            _id: user._id,
                            username: user.username,
                            profilePhotoAddress: (_a = user.profilePhoto) === null || _a === void 0 ? void 0 : _a.fileAddress,
                            isFriendRequest: !!friendRequest,
                        };
                    })));
                    console.log(users);
                    res.status(200).json({
                        status: true,
                        message: users,
                    });
                }
                else {
                    res.status(404).json({
                        status: false,
                        message: "user not found",
                    });
                }
            }
            else {
                res.status(404).json({
                    status: false,
                    message: "user not found",
                });
            }
        }
        catch (err) {
            res.status(500).json({
                status: "fail",
                message: `error has occured ${err}`,
            });
        }
    }),
    getFriendsByName: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { friendNametoFind, senderId } = req.body;
        const regExStr1 = new RegExp(`^${friendNametoFind}`, "i");
        const regExStr2 = new RegExp(`${friendNametoFind}`, "i");
        try {
            const userSender = yield userModel_1.default.findById(senderId);
            if (userSender) {
                const friendWhoseNameStartsWith = yield userModel_1.default.find({
                    $and: [
                        { username: { $regex: regExStr1 } },
                        { _id: { $in: userSender.friends } },
                    ],
                });
                const friendWhoseNameContaines = yield userModel_1.default.find({
                    $and: [
                        { username: { $regex: regExStr2 } },
                        { _id: { $in: userSender.friends } },
                    ],
                });
                const foundUsersWithDuplicates = [
                    ...friendWhoseNameStartsWith,
                    ...friendWhoseNameContaines,
                ];
                const foundFriends = [
                    ...new Set(foundUsersWithDuplicates.map((e) => JSON.stringify(e))),
                ].map((e) => JSON.parse(e));
                const filteredFriendsWithNull = yield Promise.all(foundFriends.map((friend) => __awaiter(void 0, void 0, void 0, function* () {
                    const chatRoom = yield chatRoomModel_1.default.findOne({
                        members: { $all: [senderId, friend._id] },
                    });
                    return !chatRoom ? friend : null;
                })));
                const result = filteredFriendsWithNull.filter((friend) => !!friend);
                if (result) {
                    const friends = result.map((friend) => {
                        var _a;
                        return {
                            _id: friend._id.toString(),
                            username: friend.username,
                            email: friend.email,
                            friends: friend.friends,
                            profilePhotoAddress: (_a = friend.profilePhoto) === null || _a === void 0 ? void 0 : _a.fileAddress,
                            about: friend.about,
                        };
                    });
                    console.log(friends);
                    res.status(200).json({
                        status: true,
                        message: friends,
                    });
                }
                else {
                    res.status(404).json({
                        status: false,
                        message: "friend not found",
                    });
                }
            }
            else {
                res.status(404).json({
                    status: false,
                    message: "friend not found",
                });
            }
        }
        catch (err) {
            res.status(500).json({
                status: "fail",
                message: `error has occurred. ${err}`,
            });
        }
    }),
    updateUser: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { userId, username, email, password, about } = req.body;
        const userProfileImage = req.file;
        if (username) {
            const finalUsername = username
                .split(" ")
                .map((el) => el[0].toUpperCase() + el.slice(1).toLocaleLowerCase())
                .join(" ");
            yield userModel_1.default.findOneAndUpdate({ _id: userId }, { username: finalUsername });
        }
        if (email) {
            yield userModel_1.default.findOneAndUpdate({ _id: userId }, { email: email });
        }
        if (password) {
            yield userModel_1.default.findOneAndUpdate({ _id: userId }, { password: yield hashPassword(password) });
        }
        if (userProfileImage) {
            yield userModel_1.default.findOneAndUpdate({ _id: userId }, {
                profilePhoto: {
                    filename: userProfileImage === null || userProfileImage === void 0 ? void 0 : userProfileImage.filename,
                    fileAddress: userProfileImage === null || userProfileImage === void 0 ? void 0 : userProfileImage.path.slice(7),
                },
            });
        }
        if (about) {
            yield userModel_1.default.findOneAndUpdate({ _id: userId }, { about });
        }
        const user = yield userModel_1.default.findOne({ _id: userId });
        res.cookie("authUser", user);
        res.status(200).json({
            status: "success",
            message: "User Updated",
        });
    }),
    removeFriend: function (req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { userId, friendId, chatroomId } = req.body;
            const user = yield userModel_1.default.findById(userId);
            const userFriends = user === null || user === void 0 ? void 0 : user.friends.filter((friend_id) => friend_id !== friendId);
            yield userModel_1.default.findByIdAndUpdate(user === null || user === void 0 ? void 0 : user._id, { friends: userFriends });
            const friend = yield userModel_1.default.findById(friendId);
            const friends = user === null || user === void 0 ? void 0 : user.friends.filter((friend_id) => friend_id !== userId);
            yield userModel_1.default.findByIdAndUpdate(friend === null || friend === void 0 ? void 0 : friend._id, { friends: friends });
            yield chatRoomModel_1.default.findByIdAndDelete(chatroomId);
            res.status(200).json({
                status: true,
                message: `user has been successfully removed.`,
            });
        });
    },
};
exports.default = userController;
