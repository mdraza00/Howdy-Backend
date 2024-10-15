import cookieParser from "cookie-parser";
import loginRouter from "./loginRouter";
import registerRouter from "./registerRouter";
import messageRouter from "./messageRouter";
import chatRoomRouter from "./chatRoomRouter";
import userRouter from "./userRouter";
import authenticateRouter from "./authenticateRouter";
import friendRequestRouter from "./friendRequest.routes";
import { Router } from "express";

const router = Router();

router.use("/user", userRouter);
router.use("/login", loginRouter);
router.use("/register", registerRouter);
router.use("/auth", authenticateRouter);
router.use("/chatroom", chatRoomRouter);
router.use("/message", messageRouter);
router.use("/friend-request", friendRequestRouter);

export default router;
