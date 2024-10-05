import User from "../model/userModel";
import bcypt from "bcrypt";
import jwt from "./jwt";
import { Request, Response } from "express";

const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  console.log("working...");
  try {
    const user = await User.findOne({ email });
    if (user) {
      bcypt.compare(password, user.password, function (err, result) {
        if (result) {
          res.status(200).json({
            status: true,
            data: {
              message: "User is Authorized",
              jwt_token: jwt.getJWTToken(user._id.toString()),
            },
          });
        } else {
          res.status(403).json({
            status: false,
            data: {
              message: "User is not authorized",
            },
          });
        }
      });
    } else {
      res.status(403).json({
        status: false,
        data: {
          message: "User is not authorized",
        },
      });
    }
  } catch (err) {
    console.log("some erorr has been occured. error = ", err);
  }
};

export default { loginUser };
