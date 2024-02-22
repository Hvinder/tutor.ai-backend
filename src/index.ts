import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import cors from "cors";

import connectDB from "./config/db";
import { router } from "./routes";

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 9000;

connectDB();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server");
});
app.use(morgan("[:date[iso]] :method :url :status :response-time ms"));

app.use("/api", router);

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
