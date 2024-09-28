"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authenticateUser_1 = __importDefault(require("../controller/authenticateUser"));
const authenticateRouter = (0, express_1.Router)();
authenticateRouter.post("/", authenticateUser_1.default.authenticateUser);
exports.default = authenticateRouter;
