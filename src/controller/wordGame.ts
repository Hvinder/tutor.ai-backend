import { Request, Response } from "express";
import WordGameModel, { IWordGame } from "../models/wordGame";
import {
  buildErrorResponse,
  buildSuccessResponse,
} from "../utils/buildResponse";
import {
  checkUserAnswerFromOpenai,
  fetchOpenaiTutorResponse,
} from "../service/openai";
import redisClient from "../utils/redis";

const getWordOfTheDay = async (req: Request, res: Response) => {
  const random = Math.floor(Math.random() * 3);
  const data = await WordGameModel.findOne({}).limit(-1).skip(random).lean();
  res.status(200).send(buildSuccessResponse(data?.word));
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
  const { userInput = "", questionId, word } = req.body;
  const { sessionId } = req.params;
  try {
    const wordData = await WordGameModel.findOne({ word }).lean();
    const question = wordData?.questions.find(
      (q) => q._id.toString() === questionId
    );
    if (!question) {
      throw new Error("Something went wrong");
    }
    const openaiResponse = await checkUserAnswerFromOpenai({
      question: question?.question,
      options: question?.options,
      userInput,
      sessionId,
    });
    const { message: messageFromTutor, isCorrect } = openaiResponse;
    return res
      .status(200)
      .send(buildSuccessResponse({ messageFromTutor, isCorrect }));
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
        sessionHistory,
      })
    );
  } catch (err: any) {
    return res.status(500).send(buildErrorResponse(err?.message));
  }
};

const fetchQuestion = async (req: Request, res: Response) => {
  const { sessionId } = req.params;
  const { word, attempt } = req.query;
  const wordData = await WordGameModel.findOne({ word }).lean();
  const question = wordData?.questions?.[+attempt! - 1];

  const questionContent = `${question?.question} <br/> ${question?.options?.map(
    (o, i) => `${i + 1}. ${o.value}<br/>`
  )}`;

  const responseHistory = JSON.parse(
    (await redisClient.get(sessionId)) || "[]"
  );
  responseHistory.push({ role: "system", content: questionContent });
  await redisClient.set(sessionId, JSON.stringify(responseHistory));

  return res
    .status(200)
    .send(buildSuccessResponse({ questionContent, questionId: question?._id }));
};

export {
  getWordOfTheDay,
  chatWIthTutor,
  checkAnswer,
  fetchSessionHistory,
  fetchQuestion,
};
