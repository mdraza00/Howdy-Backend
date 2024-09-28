import bcrypt from "bcrypt";
import jwt from "./jwt";
import User from "../model/userModel";
import { Request, Response } from "express";
const hashPassword: (password: string) => Promise<string> = async function (
  password
) {
  const salt = await bcrypt.genSalt(15);
  const hashedPassword = await bcrypt.hash(password, salt);
  return hashedPassword;
};

const registerNewUser = async (req: Request, res: Response) => {
  const { username, email, password } = req.body;
  const finalUsername = username
    .split(" ")
    .map((el: string) => el[0].toUpperCase() + el.slice(1).toLocaleLowerCase())
    .join(" ");
  try {
    const user = await User.create({
      username: finalUsername,
      email,
      password: await hashPassword(password),
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
          jwt_token: jwt.getJWTToken(user._id.toString()),
        },
      });
    } else
      res.status(500).json({
        status: false,
        data: {
          message: "User is not authorized",
        },
      });
  } catch (err) {
    res.status(500).json({
      status: false,
      message: `An Error has occured ${err}`,
    });
  }
};

export default { registerNewUser };
