import { Router } from "express";
import loginController from "../controller/loginController";

const loginRouter = Router();
loginRouter.post("/", loginController.loginUser);
export default loginRouter;
