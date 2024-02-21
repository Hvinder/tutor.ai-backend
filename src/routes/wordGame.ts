import express from "express";
import {
  chatWIthTutor,
  checkAnswer,
  getWordOfTheDay,
} from "../controller/wordGame";

export const wordGameRouter = express.Router();

wordGameRouter.get("/", getWordOfTheDay);
wordGameRouter.post("/chat/:sessionId", chatWIthTutor);
wordGameRouter.post("/:wordId/:questionId", checkAnswer);
