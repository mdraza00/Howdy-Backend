"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
require("dotenv/config");
const secretKey = process.env.jwtKey ? process.env.jwtKey : "";
exports.default = {
    getJWTToken: (id) => jsonwebtoken_1.default.sign({ id: id }, secretKey),
    verifyToken: (jwtToken) => {
        try {
            const data = jsonwebtoken_1.default.verify(jwtToken, secretKey);
            if (typeof data !== "string")
                return data;
        }
        catch (err) {
            return null;
        }
    },
};
