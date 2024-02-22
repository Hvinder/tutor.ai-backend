import express from "express";
import {
  chatWIthTutor,
  checkAnswer,
  fetchSessionHistory,
  getWordOfTheDay,
} from "../controller/wordGame";

export const wordGameRouter = express.Router();

wordGameRouter.get("/", getWordOfTheDay);
wordGameRouter.post("/chat/:sessionId", chatWIthTutor);
wordGameRouter.post("/:wordId/:questionId", checkAnswer);
wordGameRouter.get("/history/:sessionId", fetchSessionHistory);
