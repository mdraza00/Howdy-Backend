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
const mongoose_1 = __importDefault(require("mongoose"));
require("dotenv/config");
const socket_io_1 = require("socket.io");
const node_http_1 = require("node:http");
const app_1 = __importDefault(require("./app"));
// Connecting to mongoDB database
(function () {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const connectionString = process.env.mondoDBAccessLink;
            if (connectionString)
                yield mongoose_1.default.connect(connectionString).then(() => {
                    console.log("Database has been connected successfully");
                });
        }
        catch (err) {
            console.log("There is some error in connecting with mongoDB database");
        }
    });
})();
const server = (0, node_http_1.createServer)(app_1.default);
const io = new socket_io_1.Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
    },
});
io.on("connection", (socket) => {
    socket.on("join room", (roomId) => {
        socket.join(roomId);
    });
    socket.on("sent message", (data) => {
        io.to(data.roomId).emit("receieve message", data);
        io.to(data.roomId).emit("last message", data);
    });
    socket.on("delete-messages", (data) => {
        io.to(data.roomId).emit("delete-messages", data);
    });
});
server.listen(3000, () => {
    console.log("server is running on port 3000");
});
