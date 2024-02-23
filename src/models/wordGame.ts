import { Schema, model, Types } from "mongoose";

export interface IOption {
  _id: Types.ObjectId;
  value: string;
  isCorrect: boolean;
}
interface IQuestion {
  _id: Types.ObjectId;
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
