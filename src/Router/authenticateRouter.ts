import { Router } from "express";
import authenticateUser from "../controller/authenticateUser";
const authenticateRouter = Router();
authenticateRouter.post("/", authenticateUser.authenticateUser);
export default authenticateRouter;
