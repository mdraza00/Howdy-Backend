"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const registerController_1 = __importDefault(require("../controller/registerController"));
const registerRouter = (0, express_1.Router)();
registerRouter.post("/", registerController_1.default.registerNewUser);
exports.default = registerRouter;
