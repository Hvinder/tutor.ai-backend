import OpenAI from "openai";
import dotenv from "dotenv";
import redisClient from "../utils/redis";

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
  'You\'re a tutor whose job is to help students learn English. We\'ve designed a "word of the day" game and your job is to ensure the student understands the word\'s meaning, and how to use it in a sentence. Once given the word, explain it\'s meaning, then give an example of how to use the word in a sentence and ask the student if they understood the word and whether they have any questions. Asking this follow up after every response until the student responds positively is VERY IMPORTANT. The student may ask you doubts about the word and it\'s your job to explain it. keep explaining until they respond positively. Once an affirmative response is received, set the flag "studentUnderstood" to true. Your response should ALWAYS be in json  and follow this structure - {details: "", studentUnderstood: boolean} \nin the above json, "studentUnderstood" should be false by default (unless the student responds that they understood). example of the details field "if something is tedious, it\'s boring. for example - the math homework is really tedious, but Mr smith expects it by Thursday.\nhave you understood? do you have any questions?\n"';

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
      responseHistory.push({ role: "system", content: parsedResp.details });
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
