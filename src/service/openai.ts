import OpenAI from "openai";
import dotenv from "dotenv";
import redisClient from "../utils/redis";
import { IOption } from "../models/wordGame";

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const openaiConfig = {
  model: "gpt-4-turbo-preview",
  temperature: 1,
  max_tokens: 2000,
  top_p: 1,
  frequency_penalty: 0,
  presence_penalty: 0,
};

const WORD_OF_THE_DAY_TUTORING_PROMPT =
  'You\'re a tutor whose job is to help students learn English. We\'ve designed a "word of the day" game and your job is to ensure the student understands the word\'s meaning, and how to use it in a sentence. Once given the word, explain it\'s meaning, then give an example of how to use the word in a sentence and ask the student if they understood the word and whether they have any questions. Asking this follow up after every response until the student responds positively is VERY IMPORTANT. The student may ask you doubts about the word and it\'s your job to explain it. keep explaining until they respond positively. Once an affirmative response is received, set the flag "studentUnderstood" to true. Your response should ALWAYS be a parsable json and follow this structure - {details: "", studentUnderstood: boolean} \nin the above json, "studentUnderstood" should be false by default (unless the student responds that they understood). example of the details field "if something is tedious, it\'s boring. for example - the math homework is really tedious, but Mr smith expects it by Thursday.\nhave you understood? do you have any questions?\n"';

const generateCheckAnswerPrompt = (
  question: string,
  options: Array<Partial<IOption>>,
  userInput: string
) =>
  `you are a teacher whose job is to evaluate students response. the question you need to evaluate is "${question}". the options, in the form of {value, isCorrect} pair, are ${options
    .map((a) => JSON.stringify(a))
    .join(
      ","
    )}. The students response is "${userInput}". evaluate the students response and return result ONLY as a parsable JSON in this format {message: string, isCorrect: boolean}. The message should be a remark from the teacher (you) to the student based on their answer.`;
export const fetchOpenaiTutorResponse = async ({
  prompt,
  sessionId,
}: {
  prompt: string;
  sessionId: string;
}): Promise<{ details: string | null; studentUnderstood: boolean }> => {
  try {
    // get existing context, if any
    const responseHistory = JSON.parse(
      (await redisClient.get(sessionId)) || "[]"
    );
    console.log(responseHistory);
    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content: WORD_OF_THE_DAY_TUTORING_PROMPT,
        },
        ...responseHistory,
        {
          role: "user",
          content: prompt,
        },
      ],
      ...openaiConfig,
      response_format: { type: "json_object" },
    });
    const response = completion.choices[0].message.content;
    if (!response) {
      throw new Error(
        "The tutor appears to have gone offline. Please try again later"
      );
    }
    // update conversation context in redis
    responseHistory.push({ role: "user", content: prompt });
    // TODO: remove from redis if student understood the word.. limited storage capacity :(
    try {
      const parsedResp = JSON.parse(response || "{}");
      if (parsedResp.studentUnderstood && !parsedResp.details) {
        parsedResp.details =
          "Great! I'm glad to hear that you've understood the meaning. Feel free to ask more questions anytime!";
      }
      responseHistory.push({ role: "system", content: parsedResp.details });
      if (parsedResp.studentUnderstood) {
        responseHistory.push({
          role: "system",
          content: "Now answer the following questions",
        });
      }
      await redisClient.set(sessionId, JSON.stringify(responseHistory));
      return parsedResp;
    } catch (err) {
      // Sometimes the API returns string output instead of the specified format. This check is to handle that
      responseHistory.push({ role: "system", content: response });
      await redisClient.set(sessionId, JSON.stringify(responseHistory));
      return { details: response, studentUnderstood: false };
    }
  } catch (err: any) {
    console.error(err);
    throw err;
  }
};

export const checkUserAnswerFromOpenai = async ({
  question,
  options,
  userInput,
  sessionId,
}: {
  question: string;
  options: Array<Partial<IOption>>;
  userInput: string;
  sessionId: string;
}): Promise<{ message: string | null; isCorrect: boolean }> => {
  try {
    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content: generateCheckAnswerPrompt(question, options, userInput),
        },
      ],
      ...openaiConfig,
      response_format: { type: "json_object" },
    });
    const response = completion.choices[0].message.content;
    if (!response) {
      throw new Error(
        "The tutor appears to have gone offline. Please try again later"
      );
    }
    // update conversation context in redis
    const responseHistory = JSON.parse(
      (await redisClient.get(sessionId)) || "[]"
    );
    responseHistory.push({ role: "user", content: userInput });
    try {
      const parsedResp = JSON.parse(response || "{}");
      if (!parsedResp.message) {
        parsedResp.message = parsedResp.isCorrect
          ? "That's correct!"
          : "Sorry, that's not quite right";
      }
      responseHistory.push({ role: "system", content: parsedResp.message });
      await redisClient.set(sessionId, JSON.stringify(responseHistory));
      return parsedResp;
    } catch (err) {
      // Sometimes the API returns string output instead of the specified format. This check is to handle that
      responseHistory.push({ role: "system", content: response });
      await redisClient.set(sessionId, JSON.stringify(responseHistory));
      return { message: response, isCorrect: false };
    }
  } catch (err: any) {
    console.error(err);
    throw err;
  }
};
