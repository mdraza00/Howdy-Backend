import { Router } from "express";
import registerController from "../controller/registerController";

const registerRouter = Router();
registerRouter.post("/", registerController.registerNewUser);

export default registerRouter;
