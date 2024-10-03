"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const multer_1 = __importDefault(require("multer"));
const express_1 = require("express");
const userController_1 = __importDefault(require("../controller/userController"));
const authenticateUser_1 = __importDefault(require("../controller/authenticateUser"));
const upload = (0, multer_1.default)({
    storage: multer_1.default.diskStorage({
        destination: (req, file, cb) => {
            return cb(null, "public/uploads/userProfile");
        },
        filename: (req, file, cb) => {
            return cb(null, `${Date.now()}--${file.originalname}`);
        },
    }),
});
const userRouter = (0, express_1.Router)();
userRouter.post("/getUser", authenticateUser_1.default.authUserMiddleware, userController_1.default.getUser);
userRouter.get("/getUsers/:userId", authenticateUser_1.default.authUserMiddleware, userController_1.default.getUsers);
userRouter.post("/getUsers", authenticateUser_1.default.authUserMiddleware, userController_1.default.getUsersByName);
userRouter.post("/update", authenticateUser_1.default.authUserMiddleware, upload.single("userProfile"), userController_1.default.updateUser);
exports.default = userRouter;
