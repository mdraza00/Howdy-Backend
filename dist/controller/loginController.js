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
const bcrypt_1 = __importDefault(require("bcrypt"));
const jwt_1 = __importDefault(require("./jwt"));
const loginUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    console.log("working...");
    try {
        const user = yield userModel_1.default.findOne({ email });
        if (user) {
            bcrypt_1.default.compare(password, user.password, function (err, result) {
                if (result) {
                    res.status(200).json({
                        status: true,
                        data: {
                            message: "User is Authorized",
                            jwt_token: jwt_1.default.getJWTToken(user._id.toString()),
                        },
                    });
                }
                else {
                    res.status(403).json({
                        status: false,
                        data: {
                            message: "User is not authorized",
                        },
                    });
                }
            });
        }
        else {
            res.status(403).json({
                status: false,
                data: {
                    message: "User is not authorized",
                },
            });
        }
    }
    catch (err) {
        console.log("some erorr has been occured. error = ", err);
    }
});
exports.default = { loginUser };
