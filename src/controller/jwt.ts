import jwt from "jsonwebtoken";
import "dotenv/config";

const secretKey: string = process.env.jwtKey ? process.env.jwtKey : "";

export default {
  getJWTToken: (id: string) => jwt.sign({ id: id }, secretKey),
  verifyToken: (jwtToken: string) => {
    try {
      const data = jwt.verify(jwtToken, secretKey);
      if (typeof data !== "string") return data;
    } catch (err) {
      return null;
    }
  },
};
