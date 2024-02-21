import { Request, Response } from "express";
import WordGameModel, { IWordGame } from "../models/wordGame";
import {
  buildErrorResponse,
  buildSuccessResponse,
} from "../utils/buildResponse";
import { fetchOpenaiTutorResponse } from "../service/openai";

const getWordOfTheDay = async (req: Request, res: Response) => {
  const random = Math.floor(Math.random() * 3);
  const data = await WordGameModel.findOne({}).limit(-1).skip(random).lean();
  const transformedData = {
    ...data,
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
  const openaiResponse = await fetchOpenaiTutorResponse({
    prompt: userInput,
    sessionId,
  });
  // Sometimes the API returns string output instead of the specified format. This check is to handle that
  const messageFromTutor =
    typeof openaiResponse === "object"
      ? openaiResponse.details
      : openaiResponse;
  const studentUnderstood =
    typeof openaiResponse === "object"
      ? openaiResponse.studentUnderstood
      : false;
  res
    .status(200)
    .send(buildSuccessResponse({ messageFromTutor, studentUnderstood }));
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

export { getWordOfTheDay, chatWIthTutor, checkAnswer };
