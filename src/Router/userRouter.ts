import multer from "multer";
import { Request, Response, NextFunction, Router } from "express";
import userController from "../controller/userController";
import authenticateUser from "../controller/authenticateUser";

const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      return cb(null, "public/uploads/userProfile");
    },
    filename: (req, file, cb) => {
      return cb(null, `${Date.now()}--${file.originalname}`);
    },
  }),
});

const userRouter = Router();
userRouter.post(
  "/getUser",
  authenticateUser.authUserMiddleware,
  userController.getUser
);
userRouter.get(
  "/getUsers/:userId",
  authenticateUser.authUserMiddleware,
  userController.getUsers
);
userRouter.get(
  "/get-friends/:userId",
  authenticateUser.authUserMiddleware,
  userController.getFriends
);
userRouter.post(
  "/getUsers",
  authenticateUser.authUserMiddleware,
  userController.getUsersByName
);
userRouter.post(
  "/getFriendsByName",
  authenticateUser.authUserMiddleware,
  userController.getFriendsByName
);
userRouter.patch(
  "/remove-friend",
  authenticateUser.authUserMiddleware,
  userController.removeFriend
);
userRouter.post(
  "/update",
  authenticateUser.authUserMiddleware,
  upload.single("userProfile"),
  userController.updateUser
);
export default userRouter;
