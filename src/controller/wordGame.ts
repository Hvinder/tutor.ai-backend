import { Request, Response } from "express";
import WordGameModel, { IWordGame } from "../models/wordGame";
import {
  buildErrorResponse,
  buildSuccessResponse,
} from "../utils/buildResponse";
import { fetchOpenaiTutorResponse } from "../service/openai";
import redisClient from "../utils/redis";

const getWordOfTheDay = async (req: Request, res: Response) => {
  const random = Math.floor(Math.random() * 3);
  const data = await WordGameModel.findOne({}).limit(-1).skip(random).lean();
  const transformedData = {
    word: data?.word,
    questions: (data?.questions || []).map((q) => ({
      ...q,
      options: q.options.map((o) => ({ _id: o._id, value: o.value })),
    })),
  };
  res.status(200).send(buildSuccessResponse(transformedData));
};

const chatWIthTutor = async (req: Request, res: Response) => {
  const { userInput } = req.body;
  const { sessionId } = req.params;
  try {
    const openaiResponse = await fetchOpenaiTutorResponse({
      prompt: userInput,
      sessionId,
    });
    const { details: messageFromTutor, studentUnderstood } = openaiResponse;
    res
      .status(200)
      .send(buildSuccessResponse({ messageFromTutor, studentUnderstood }));
  } catch (err: any) {
    res.status(500).send(buildErrorResponse(err?.message));
  }
};

const checkAnswer = async (req: Request, res: Response) => {
  const { optionResponse = "" } = req.body;
  const { questionId, wordId } = req.params;
  try {
    const wordData = await WordGameModel.findOne({ _id: wordId }).lean();
    const question = wordData?.questions.find(
      (q) => q._id.toString() === questionId
    );
    // TODO: check option is correct
    const isCorrect =
      optionResponse.toLowerCase() ===
      question?.options.find((o) => o.isCorrect)?.value.toLowerCase();
    return res.status(200).send(buildSuccessResponse({ isCorrect }));
  } catch (err: any) {
    return res.status(500).send(buildErrorResponse(err?.message));
  }
};

const fetchSessionHistory = async (req: Request, res: Response) => {
  const { sessionId } = req.params;
  try {
    const sessionHistory = JSON.parse(
      (await redisClient.get(sessionId)) || "[]"
    );
    return res.status(200).send(
      buildSuccessResponse({
        sessionHistory: sessionHistory.map((s: any) => ({
          ...s,
          content:
            typeof s.content === "object" ? s.content : JSON.parse(s.content),
        })),
      })
    );
  } catch (err: any) {
    return res.status(500).send(buildErrorResponse(err?.message));
  }
};

export { getWordOfTheDay, chatWIthTutor, checkAnswer, fetchSessionHistory };
