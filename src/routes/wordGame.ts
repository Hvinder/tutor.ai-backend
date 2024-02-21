import express from "express";
import { checkAnswer, getWordOfTheDay } from "../controller/wordGame";

export const wordGameRouter = express.Router();

wordGameRouter.get("/", getWordOfTheDay);
wordGameRouter.post("/:wordId/:questionId", checkAnswer);
