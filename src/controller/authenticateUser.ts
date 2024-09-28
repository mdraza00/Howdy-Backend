import { NextFunction, Request, Response } from "express";
import jwt from "./jwt";

export default {
  authenticateUser: function (req: Request, res: Response) {
    const { token } = req.body;
    const data = jwt.verifyToken(token);
    if (data) {
      res
        .status(200)
        .json({ status: true, data: { message: "jwt is valid", id: data.id } });
    } else {
      res.status(401).json({
        status: false,
        data: {
          message: "jwt is not valid",
          id: "",
        },
      });
    }
  },

  authUserMiddleware: (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization;
    if (token) {
      const result = jwt.verifyToken(token.split(" ")[1]);
      if (result) {
        next();
      } else {
        res
          .status(401)
          .json({ status: false, message: "user is not authorized" });
      }
    } else {
      res
        .status(401)
        .json({ status: false, message: "user is not authorized" });
    }
  },
};
