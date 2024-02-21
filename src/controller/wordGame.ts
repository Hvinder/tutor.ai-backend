import { Request, Response } from "express";
import WordGameModel, { IWordGame } from "../models/wordGame";
import {
  buildErrorResponse,
  buildSuccessResponse,
} from "../utils/buildResponse";

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

export { getWordOfTheDay, checkAnswer };
