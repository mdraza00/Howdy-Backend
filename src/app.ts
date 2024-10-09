import express, { Express } from "express";
import path from "path";
import cookieParser from "cookie-parser";
import loginRouter from "./Router/loginRouter";
import registerRouter from "./Router/registerRouter";
import messageRouter from "./Router/messageRouter";
import chatRoomRouter from "./Router/chatRoomRouter";
import userRouter from "./Router/userRouter";
import authenticateRouter from "./Router/authenticateRouter";
import cors from "cors";

const app: Express = express();
const corsOptions = {
  origin: "http://192.168.116.164:5173",
  credentials: true,
};
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.resolve("public")));
app.use("/user", userRouter);
app.use("/login", loginRouter);
app.use("/register", registerRouter);
app.use("/auth", authenticateRouter);
app.use("/chatroom", chatRoomRouter);
app.use("/message", messageRouter);
export default app;
