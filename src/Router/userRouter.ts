import multer from "multer";
import { Router } from "express";
import userController from "../controller/userController";
import authenticateUser from "../controller/authenticateUser";

const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      return cb(null, "public/uploads/");
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
userRouter.post(
  "/getUsers",
  authenticateUser.authUserMiddleware,
  userController.getUsersByName
);
userRouter.post(
  "/update",
  authenticateUser.authUserMiddleware,
  upload.single("userProfile"),
  userController.updateUser
);
export default userRouter;
