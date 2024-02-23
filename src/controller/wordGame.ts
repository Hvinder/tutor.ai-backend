import { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";

import WordGameModel from "../models/wordGame";
import GameSessionModel, { Message } from "../models/gameSession";
import {
  checkUserAnswerFromOpenai,
  fetchOpenaiTutorResponse,
} from "../service/openai";
import {
  updateGameSession,
  getGameSession,
  markGameSessionComplete,
  markGameSessionRestart,
} from "../service/GameSession";
import {
  buildErrorResponse,
  buildSuccessResponse,
} from "../utils/buildResponse";

const chatWIthTutor = async (req: Request, res: Response) => {
  const { userInput, tempId } = req.body;
  const { sessionId } = req.params;
  try {
    let gameSession = await getGameSession({ sessionId });
    if (!gameSession) {
      throw new Error("Invalid session id");
    }

    const { details, studentUnderstood } =
      (await fetchOpenaiTutorResponse({
        prompt: userInput,
        messageHistory: gameSession.messageHistory,
      })) || {};
    const newMessages: Message[] = [];
    newMessages.push({
      role: "user",
      content: userInput,
      _id: tempId || uuidv4(),
    });
    newMessages.push({ role: "system", content: details, _id: uuidv4() });
    if (studentUnderstood) {
      newMessages.push({
        role: "system",
        content: "Now answer the following questions",
        _id: uuidv4(),
      });
    }
    gameSession = await updateGameSession({
      sessionId,
      messages: newMessages,
      studentUnderstood: studentUnderstood,
    });

    res.status(200).send(buildSuccessResponse(gameSession));
  } catch (err: any) {
    res.status(500).send(buildErrorResponse(err?.message));
  }
};

const checkAnswer = async (req: Request, res: Response) => {
  const { userInput = "", questionId, word, tempId } = req.body;
  const { sessionId } = req.params;
  try {
    const wordData = await WordGameModel.findOne({ word }).lean();
    const question = wordData?.questions.find(
      (q) => q._id.toString() === questionId
    );
    if (!question) {
      throw new Error("Something went wrong");
    }
    const { message, isCorrect } =
      (await checkUserAnswerFromOpenai({
        question: question?.question,
        options: question?.options,
        userInput,
      })) || {};
    const newMessages: Message[] = [];
    newMessages.push({
      role: "user",
      content: userInput,
      _id: tempId || uuidv4(),
    });
    newMessages.push({ role: "system", content: message, _id: uuidv4() });

    let gameSession = await updateGameSession({
      sessionId,
      messages: newMessages,
      studentUnderstood: true,
      incrementScore: isCorrect,
      incrementAttempt: true,
    });
    if (gameSession?.studentScore === 2) {
      gameSession = await markGameSessionComplete({ sessionId });
    }
    if (
      (gameSession?.questionsAttempt || 0) > 3 &&
      (gameSession?.studentScore || 0) < 2
    ) {
      gameSession = await markGameSessionRestart({ sessionId });
    }

    return res.status(200).send(buildSuccessResponse(gameSession));
  } catch (err: any) {
    return res.status(500).send(buildErrorResponse(err?.message));
  }
};

const fetchSession = async (req: Request, res: Response) => {
  const { sessionId } = req.params;
  try {
    let gameSession = await getGameSession({ sessionId });
    if (!gameSession) {
      // init new session
      const random = Math.floor(Math.random() * 3);
      const data = await WordGameModel.findOne({})
        .limit(-1)
        .skip(random)
        .lean();
      gameSession = await GameSessionModel.create({
        id: sessionId,
        word: data?.word,
      });
    }

    return res.status(200).send(buildSuccessResponse(gameSession));
  } catch (err: any) {
    return res.status(500).send(buildErrorResponse(err?.message));
  }
};

const fetchQuestion = async (req: Request, res: Response) => {
  const { sessionId } = req.params;
  const { word, attempt } = req.query;
  const wordData = await WordGameModel.findOne({ word }).lean();
  const question = wordData?.questions?.[+attempt! - 1];

  const questionContent = `${question?.question} <br/> ${question?.options
    ?.map((o, i) => `${i + 1}. ${o.value}`)
    .join("<br/>")}`;

  const gameSession = await updateGameSession({
    sessionId,
    messages: [{ role: "system", content: questionContent, _id: uuidv4() }],
    studentUnderstood: true,
  });

  return res
    .status(200)
    .send(buildSuccessResponse({ gameSession, questionId: question?._id }));
};

export { chatWIthTutor, checkAnswer, fetchSession, fetchQuestion };
