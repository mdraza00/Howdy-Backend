import express, { Express } from "express";
import path from "path";
import cors from "cors";
import router from "./Router";

const app: Express = express();
const corsOptions = {
  origin: "http://192.168.182.164:5173",
  credentials: true,
};
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.resolve("public")));
app.use("/api", router);
export default app;
