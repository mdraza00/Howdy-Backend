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
const bcrypt_1 = __importDefault(require("bcrypt"));
const jwt_1 = __importDefault(require("./jwt"));
const userModel_1 = __importDefault(require("../model/userModel"));
const hashPassword = function (password) {
    return __awaiter(this, void 0, void 0, function* () {
        const salt = yield bcrypt_1.default.genSalt(15);
        const hashedPassword = yield bcrypt_1.default.hash(password, salt);
        return hashedPassword;
    });
};
const registerNewUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, email, password } = req.body;
    const finalUsername = username
        .split(" ")
        .map((el) => el[0].toUpperCase() + el.slice(1).toLocaleLowerCase())
        .join(" ");
    try {
        const user = yield userModel_1.default.create({
            username: finalUsername,
            email,
            password: yield hashPassword(password),
            profilePhoto: {
                filename: "defaultImage",
                fileAddress: "uploads/default image.png",
            },
        });
        if (user) {
            res.status(200).json({
                status: true,
                data: {
                    message: "User is Authorized",
                    jwt_token: jwt_1.default.getJWTToken(user._id.toString()),
                },
            });
        }
        else
            res.status(500).json({
                status: false,
                data: {
                    message: "User is not authorized",
                },
            });
    }
    catch (err) {
        res.status(500).json({
            status: false,
            message: `An Error has occured ${err}`,
        });
    }
});
exports.default = { registerNewUser };
