import express from "express";
import {
  chatWIthTutor,
  checkAnswer,
  fetchQuestion,
  fetchSessionHistory,
  getWordOfTheDay,
} from "../controller/wordGame";

export const wordGameRouter = express.Router();

wordGameRouter.get("/", getWordOfTheDay);
wordGameRouter.post("/chat/:sessionId", chatWIthTutor);
wordGameRouter.post("/answer/:sessionId", checkAnswer);
wordGameRouter.get("/history/:sessionId", fetchSessionHistory);
wordGameRouter.get("/question/:sessionId", fetchQuestion);
