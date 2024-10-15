import { Request, response, Response } from "express";
import User from "../model/userModel";
import ChatRoom from "../model/chatRoomModel";
import bcrypt from "bcrypt";
import Friend_Request from "../model/friendRequest.model";

const hashPassword: (password: string) => Promise<string> = async function (
  password
) {
  const salt = await bcrypt.genSalt(15);
  const hashedPassword = await bcrypt.hash(password, salt);
  return hashedPassword;
};

const userController = {
  getUser: async (req: Request, res: Response) => {
    const { userId } = req.body;
    try {
      const user = await User.findOne({ _id: userId });
      if (user) {
        res.status(200).json({
          status: true,
          data: {
            name: user.username,
            profilePhoto: user.profilePhoto?.fileAddress,
            email: user.email,
            about: user.about,
          },
        });
      } else {
        res.status(404).json({
          status: false,
          data: null,
        });
      }
    } catch (err) {
      res.status(500).json({
        status: false,
        data: null,
      });
    }
  },

  getUsers: async (req: Request, res: Response) => {
    const { userId } = req.params;
    try {
      const user = await User.findOne({ _id: userId });
      if (user) {
        const users = await User.find({
          _id: { $nin: [...user.friends, user._id.toString()] },
        });

        const usersData = await Promise.all(
          users.map(async (user) => {
            const friendRequest = await Friend_Request.findOne({
              request_to: user._id.toString(),
              request_by: userId,
            });

            return {
              _id: user._id.toString(),
              username: user.username,
              profilePhotoAddress: user.profilePhoto?.fileAddress,
              isFriendRequest: !!friendRequest,
            };
          })
        );
        res.status(200).json({
          status: true,
          message: usersData,
        });
      } else {
        res.send(404).json({ status: false, message: "user not found." });
      }
    } catch (err) {
      res.status(500).json({
        status: "fail",
        message: `error has occurred ${err}`,
      });
    }
  },
  getUsersByName: async (req: Request, res: Response) => {
    const { userNametoFind, senderId } = req.body;
    const regExStr1 = new RegExp(`^${userNametoFind}`, "i");
    const regExStr2 = new RegExp(`${userNametoFind}`, "i");

    try {
      const userSender = await User.findById(senderId);
      if (userSender) {
        const usersWhoseNameStartsWith = await User.find({
          $and: [
            { username: { $regex: regExStr1 } },
            { _id: { $nin: [...userSender.friends, senderId] } },
          ],
        });

        const usersWhoseNameContaines = await User.find({
          $and: [
            { username: { $regex: regExStr2 } },
            { _id: { $nin: [...userSender.friends, senderId] } },
          ],
        });

        const foundUsersWithDuplicates = [
          ...usersWhoseNameStartsWith,
          ...usersWhoseNameContaines,
        ];

        const foundUsers = [
          ...new Set(foundUsersWithDuplicates.map((e) => JSON.stringify(e))),
        ].map((e) => JSON.parse(e));

        const filteredUsersWithNull = await Promise.all(
          foundUsers.map(async (user) => {
            const chatRoom = await ChatRoom.findOne({
              members: { $all: [senderId, user._id] },
            });
            return !chatRoom ? user : null;
          })
        );

        const result = filteredUsersWithNull.filter((user) => !!user);

        if (result) {
          const users = await Promise.all(
            result.map(async (user) => {
              const friendRequest = await Friend_Request.findOne({
                request_to: user._id.toString(),
                request_by: senderId,
              });

              return {
                _id: user._id,
                username: user.username,
                profilePhotoAddress: user.profilePhoto?.fileAddress,
                isFriendRequest: !!friendRequest,
              };
            })
          );
          console.log(users);

          res.status(200).json({
            status: true,
            message: users,
          });
        } else {
          res.status(404).json({
            status: false,
            message: "user not found",
          });
        }
      } else {
        res.status(404).json({
          status: false,
          message: "user not found",
        });
      }
    } catch (err) {
      res.status(500).json({
        status: "fail",
        message: `error has occured ${err}`,
      });
    }
  },

  updateUser: async (req: Request, res: Response) => {
    const { userId, username, email, password, about } = req.body;

    const userProfileImage = req.file;
    if (username) {
      const finalUsername = username
        .split(" ")
        .map(
          (el: string) => el[0].toUpperCase() + el.slice(1).toLocaleLowerCase()
        )
        .join(" ");
      await User.findOneAndUpdate({ _id: userId }, { username: finalUsername });
    }
    if (email) {
      await User.findOneAndUpdate({ _id: userId }, { email: email });
    }
    if (password) {
      await User.findOneAndUpdate(
        { _id: userId },
        { password: await hashPassword(password) }
      );
    }
    if (userProfileImage) {
      await User.findOneAndUpdate(
        { _id: userId },
        {
          profilePhoto: {
            filename: userProfileImage?.filename,
            fileAddress: userProfileImage?.path.slice(7),
          },
        }
      );
    }
    if (about) {
      await User.findOneAndUpdate({ _id: userId }, { about });
    }
    const user = await User.findOne({ _id: userId });
    res.cookie("authUser", user);
    res.status(200).json({
      status: "success",
      message: "User Updated",
    });
  },
};
export default userController;
