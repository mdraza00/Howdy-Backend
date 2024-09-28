"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jwt_1 = __importDefault(require("./jwt"));
exports.default = {
    authenticateUser: function (req, res) {
        const { token } = req.body;
        const data = jwt_1.default.verifyToken(token);
        if (data) {
            res
                .status(200)
                .json({ status: true, data: { message: "jwt is valid", id: data.id } });
        }
        else {
            res.status(401).json({
                status: false,
                data: {
                    message: "jwt is not valid",
                    id: "",
                },
            });
        }
    },
    authUserMiddleware: (req, res, next) => {
        const token = req.headers.authorization;
        if (token) {
            const result = jwt_1.default.verifyToken(token.split(" ")[1]);
            if (result) {
                next();
            }
            else {
                res
                    .status(401)
                    .json({ status: false, message: "user is not authorized" });
            }
        }
        else {
            res
                .status(401)
                .json({ status: false, message: "user is not authorized" });
        }
    },
};
