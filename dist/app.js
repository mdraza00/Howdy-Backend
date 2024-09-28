"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const loginRouter_1 = __importDefault(require("./Router/loginRouter"));
const registerRouter_1 = __importDefault(require("./Router/registerRouter"));
const messageRouter_1 = __importDefault(require("./Router/messageRouter"));
const chatRoomRouter_1 = __importDefault(require("./Router/chatRoomRouter"));
const userRouter_1 = __importDefault(require("./Router/userRouter"));
const authenticateRouter_1 = __importDefault(require("./Router/authenticateRouter"));
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
const corsOptions = {
    origin: "*",
};
app.use((0, cors_1.default)(corsOptions));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
app.use(express_1.default.static(path_1.default.resolve("public")));
app.use("/user", userRouter_1.default);
app.use("/login", loginRouter_1.default);
app.use("/register", registerRouter_1.default);
app.use("/auth", authenticateRouter_1.default);
app.use("/chatroom", chatRoomRouter_1.default);
app.use("/message", messageRouter_1.default);
exports.default = app;
