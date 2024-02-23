import { v4 as uuidv4 } from "uuid";
import GameSessionModel, { Message } from "../models/gameSession";

export const updateGameSession = async ({
  sessionId,
  messages,
  studentUnderstood,
  incrementScore = false,
  incrementAttempt = false,
}: {
  sessionId: string;
  messages: Message[];
  studentUnderstood: boolean;
  incrementScore?: boolean;
  incrementAttempt?: boolean;
}) => {
  return await GameSessionModel.findOneAndUpdate(
    { id: sessionId },
    {
      $push: { messageHistory: { $each: messages } },
      $inc: {
        studentScore: incrementScore ? 1 : 0,
        questionsAttempt: incrementAttempt ? 1 : 0,
      },
      studentUnderstood,
    },
    { new: true }
  );
};

export const markGameSessionComplete = async ({
  sessionId,
}: {
  sessionId: string;
}) => {
  const messages: Message[] = [];
  messages.push({
    role: "system",
    content:
      "Congratulations! You've successfully learnt the word. Try using it while conversing with your friends.",
    _id: uuidv4(),
  });
  return await GameSessionModel.findOneAndUpdate(
    { id: sessionId },
    {
      $push: { messageHistory: { $each: messages } },
      isComplete: true,
    },
    { new: true }
  );
};

export const markGameSessionRestart = async ({
  sessionId,
}: {
  sessionId: string;
}) => {
  const messages: Message[] = [];
  messages.push({
    role: "system",
    content:
      "You may need to revisit the word again. Let's try learning from the top and circle back to the questions.",
    _id: uuidv4(),
  });
  return await GameSessionModel.findOneAndUpdate(
    { id: sessionId },
    {
      $push: { messageHistory: { $each: messages } },
      isLearnAgain: true,
    },
    { new: true }
  );
};

export const getGameSession = async ({ sessionId }: { sessionId: string }) => {
  return await GameSessionModel.findOne({ id: sessionId }).lean();
};
