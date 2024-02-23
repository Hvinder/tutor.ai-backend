import { Schema, model, Types } from "mongoose";
import { v4 as uuidv4 } from "uuid";

type MessageRole = "user" | "system";

export interface Message {
  _id: string;
  role: MessageRole;
  content: string;
}

export interface IGameSession {
  id: string;
  messageHistory: Message[];
  questionsAttempt: number;
  // currentQuestionId?: string;
  studentScore: number;
  studentUnderstood: boolean;
  isComplete: boolean;
  isLearnAgain: boolean;
  word: string;
}

const gameSessionSchema = new Schema<IGameSession>(
  {
    id: { type: String, required: true },
    messageHistory: {
      type: [
        {
          role: String,
          content: String,
          _id: { type: String, default: uuidv4() },
        },
      ],
      default: [],
    },
    questionsAttempt: { type: Number, default: 1 },
    // currentQuestionId: { type: String },
    studentScore: { type: Number, default: 0 },
    studentUnderstood: { type: Boolean, default: false },
    isComplete: { type: Boolean, default: false },
    isLearnAgain: { type: Boolean, default: false },
    word: { type: String, required: true },
  },
  { timestamps: true }
);

const GameSessionModel = model<IGameSession>("GameSession", gameSessionSchema);

export default GameSessionModel;
