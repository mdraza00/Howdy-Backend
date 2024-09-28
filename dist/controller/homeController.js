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
const renderHomePage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.cookies.authUser) {
        const userId = req.cookies.authUser;
        const currentUser = yield userModel_1.default.findOne({ _id: userId });
        if (currentUser) {
            res.render("home", { currentUserID: currentUser._id.toString() });
        }
        else {
            res.redirect("/login");
        }
    }
    else {
        res.redirect("/login");
    }
});
exports.default = { renderHomePage };
