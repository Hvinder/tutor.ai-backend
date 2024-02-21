import { Schema, model } from "mongoose";

interface IOption {
  value: string;
  isCorrect: boolean;
}
interface IQuestion {
  question: string;
  options: IOption[];
}

export interface IWordGame {
  word: string;
  usedCount: number;
  successfullyCompletedCount: number;
  questions: IQuestion[];
}

const wordGameSchema = new Schema<IWordGame>(
  {
    word: { type: String, required: true },
    usedCount: { type: Number, default: 0 },
    successfullyCompletedCount: { type: Number, default: 0 },
    questions: {
      type: [
        { question: String, options: [{ value: String, isCorrect: Boolean }] },
      ],
    },
  },
  { timestamps: true }
);

const WordGameModel = model<IWordGame>("WordGame", wordGameSchema);

export default WordGameModel;
