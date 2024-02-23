import express from "express";
import {
  chatWIthTutor,
  checkAnswer,
  fetchQuestion,
  fetchSession,
} from "../controller/wordGame";

export const wordGameRouter = express.Router();

wordGameRouter.get("/:sessionId", fetchSession);
wordGameRouter.get("/question/:sessionId", fetchQuestion);
wordGameRouter.post("/chat/:sessionId", chatWIthTutor);
wordGameRouter.post("/answer/:sessionId", checkAnswer);
