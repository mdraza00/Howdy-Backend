import { Request, Response } from "express";
import User from "../model/userModel";
import ChatRoom from "../model/chatRoomModel";

const renderHomePage = async (req: Request, res: Response) => {
  if (req.cookies.authUser) {
    const userId = req.cookies.authUser;
    const currentUser = await User.findOne({ _id: userId });
    if (currentUser) {
      res.render("home", { currentUserID: currentUser._id.toString() });
    } else {
      res.redirect("/login");
    }
  } else {
    res.redirect("/login");
  }
};

export default { renderHomePage };
