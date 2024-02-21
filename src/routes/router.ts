import express from "express";
import { wordGameRouter } from "./wordGame";

export const router = express.Router();

router.use("/word-game", wordGameRouter);
