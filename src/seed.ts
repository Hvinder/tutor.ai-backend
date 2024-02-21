import mongoose from "mongoose";
import dotenv from "dotenv";
import connectDB from "./config/db";
import WordGameModel, { IWordGame } from "./models/wordGame";

const seed = async () => {
  dotenv.config();
  await connectDB();
  const data = [
    {
      word: "Tedious",
      questions: [
        {
          question: 'What does the word "tedious" mean?',
          options: [
            { value: "Extremely fun", isCorrect: false },
            { value: "Quick and easy", isCorrect: false },
            { value: "Long and boring", isCorrect: true },
            { value: "Loud and exciting", isCorrect: false },
          ],
        },
        {
          question:
            'Which of the following activities might be considered "tedious"?',
          options: [
            { value: "Riding a roller coaster", isCorrect: false },
            { value: "Watching your favorite movie", isCorrect: false },
            {
              value: "Sorting a large pile of socks by color",
              isCorrect: true,
            },
            { value: "Playing a video game with friends", isCorrect: false },
          ],
        },
        {
          question:
            'If someone says a task is "tedious," how do they likely feel about doing it?',
          options: [
            { value: "Excited", isCorrect: false },
            { value: "Happy", isCorrect: false },
            { value: "Annoyed or bored", isCorrect: true },
            { value: "Surprised", isCorrect: false },
          ],
        },
        {
          question: 'Choose the sentence where "tedious" is used correctly.',
          options: [
            {
              value:
                "The party was tedious because everyone was dancing and having fun.",
              isCorrect: false,
            },
            {
              value:
                "The tedious movie kept everyone on the edge of their seats with its action scenes.",
              isCorrect: false,
            },
            {
              value:
                "Filling out the long and complicated form felt tedious to him.",
              isCorrect: true,
            },
            {
              value:
                "She found the roller coaster ride tedious even though it was fast and thrilling.",
              isCorrect: false,
            },
          ],
        },
        {
          question:
            'Which task would most likely NOT be described as "tedious"?',
          options: [
            {
              value:
                "Completing a 1000-piece jigsaw puzzle of a clear blue sky",
              isCorrect: false,
            },
            {
              value: "Reading a book you find extremely interesting",
              isCorrect: true,
            },
            { value: "Copying a dictionary by hand", isCorrect: false },
            { value: "Watching paint dry", isCorrect: false },
          ],
        },
        {
          question: 'What is the best synonym for "tedious"?',
          options: [
            { value: "Exciting", isCorrect: false },
            { value: "Monotonous", isCorrect: true },
            { value: "Fascinating", isCorrect: false },
            { value: "Brief", isCorrect: false },
          ],
        },
        {
          question: 'Which scenario is an example of a "tedious" task?',
          options: [
            { value: "Watching a short, funny video clip", isCorrect: false },
            {
              value: "Playing a fast-paced game on a playground",
              isCorrect: false,
            },
            {
              value: "Reading an engaging novel with lots of adventure",
              isCorrect: false,
            },
            {
              value: "Counting all the grains of rice in a large bag",
              isCorrect: true,
            },
          ],
        },
        {
          question: 'Why might someone describe a task as "tedious"?',
          options: [
            { value: "Because it is completed very quickly", isCorrect: false },
            {
              value: "Because it requires a lot of effort over a long period",
              isCorrect: true,
            },
            { value: "Because it is extremely entertaining", isCorrect: false },
            {
              value: "Because it requires no attention or effort",
              isCorrect: false,
            },
          ],
        },
        {
          question:
            'If a book is described as "tedious," what might that imply about the book?',
          options: [
            {
              value: "It is very interesting and easy to read.",
              isCorrect: false,
            },
            {
              value: "It has a lot of pictures and short chapters.",
              isCorrect: false,
            },
            {
              value: "It is long, detailed, and not very engaging.",
              isCorrect: true,
            },
            {
              value: "It is full of suspense and unexpected twists.",
              isCorrect: false,
            },
          ],
        },
      ],
    },
    {
      word: "Sacrosanct",
      questions: [
        {
          question: 'What does "sacrosanct" mean?',
          options: [
            { value: "Easily broken", isCorrect: false },
            { value: "Extremely holy and not to be violated", isCorrect: true },
            { value: "Open for discussion", isCorrect: false },
            { value: "Common and unimportant", isCorrect: false },
          ],
        },
        {
          question:
            "Which of the following is considered sacrosanct in many cultures?",
          options: [
            { value: "A favorite television show", isCorrect: false },
            { value: "A place of worship", isCorrect: true },
            { value: "A local supermarket", isCorrect: false },
            { value: "A public park", isCorrect: false },
          ],
        },
        {
          question: "What type of objects could be described as sacrosanct?",
          options: [
            { value: "Everyday household items", isCorrect: false },
            { value: "Religious artifacts", isCorrect: true },
            { value: "Used clothing", isCorrect: false },
            { value: "Old newspapers", isCorrect: false },
          ],
        },
        {
          question:
            "If someone says a tradition is sacrosanct, they mean it is:",
          options: [
            { value: "Open to change at any time", isCorrect: false },
            {
              value: "Not very important and can be skipped",
              isCorrect: false,
            },
            {
              value: "Highly respected and must not be altered",
              isCorrect: true,
            },
            { value: "Boring and outdated", isCorrect: false },
          ],
        },
        {
          question:
            "Which of the following situations involves something sacrosanct?",
          options: [
            { value: "Arguing over what movie to watch", isCorrect: false },
            { value: "Changing the rules of a game for fun", isCorrect: false },
            {
              value: "Protecting the integrity of a sacred ceremony",
              isCorrect: true,
            },
            { value: "Deciding what to have for dinner", isCorrect: false },
          ],
        },
        {
          question: "A sacrosanct belief is one that:",
          options: [
            { value: "Can be easily dismissed", isCorrect: false },
            {
              value: "Is held above all others and protected from criticism",
              isCorrect: true,
            },
            { value: "Changes frequently", isCorrect: false },
            {
              value: "Is not taken seriously by most people",
              isCorrect: false,
            },
          ],
        },
        {
          question:
            "Which of the following is NOT an example of something sacrosanct?",
          options: [
            { value: "A country’s constitution", isCorrect: false },
            { value: "A historical monument", isCorrect: false },
            { value: "A celebrity’s opinion", isCorrect: true },
            { value: "A religious text", isCorrect: false },
          ],
        },
        {
          question:
            "The concept of human rights is often considered sacrosanct, meaning:",
          options: [
            { value: "It is outdated and needs revision", isCorrect: false },
            {
              value: "It is universally respected and inviolable",
              isCorrect: true,
            },
            {
              value: "It is controversial and widely debated",
              isCorrect: false,
            },
            {
              value: "It is insignificant in the modern world",
              isCorrect: false,
            },
          ],
        },
        {
          question: "Why would someone describe a principle as sacrosanct?",
          options: [
            { value: "Because it is no longer relevant", isCorrect: false },
            {
              value: "Because it is the foundation of their belief system",
              isCorrect: true,
            },
            {
              value: "Because it is a new idea that is not yet understood",
              isCorrect: false,
            },
            { value: "Because it is a popular trend", isCorrect: false },
          ],
        },
        {
          question:
            "In a legal context, if a right is described as sacrosanct, this means it is:",
          options: [
            { value: "Open to interpretation", isCorrect: false },
            { value: "Considered absolute and untouchable", isCorrect: true },
            { value: "Rarely acknowledged", isCorrect: false },
            { value: "Subject to change in every case", isCorrect: false },
          ],
        },
      ],
    },
    {
      word: "Unfathomable",
      questions: [
        {
          question: 'What does "unfathomable" mean?',
          options: [
            { value: "Shallow and easy to see through", isCorrect: false },
            { value: "Clear and understandable", isCorrect: false },
            {
              value: "So deep or complex as to be impossible to understand",
              isCorrect: true,
            },
            { value: "Bright and colorful", isCorrect: false },
          ],
        },
        {
          question:
            'Which of these scenarios best describes an "unfathomable" mystery?',
          options: [
            {
              value: "A puzzle that takes 5 minutes to solve",
              isCorrect: false,
            },
            {
              value: "A crime that was solved in less than an hour",
              isCorrect: false,
            },
            {
              value: "A secret that has puzzled experts for centuries",
              isCorrect: true,
            },
            {
              value: "A straightforward question with an obvious answer",
              isCorrect: false,
            },
          ],
        },
        {
          question:
            "The depths of the ocean are often considered unfathomable because:",
          options: [
            { value: "They are shallow and easily explored", isCorrect: false },
            {
              value: "They are brightly lit and full of colorful fish",
              isCorrect: false,
            },
            {
              value: "They are so deep that they have not been fully explored",
              isCorrect: true,
            },
            { value: "They are always calm and peaceful", isCorrect: false },
          ],
        },
        {
          question: "An unfathomable decision is one that:",
          options: [
            { value: "Makes sense to everyone immediately", isCorrect: false },
            {
              value: "Is agreed upon by all parties involved",
              isCorrect: false,
            },
            {
              value: "Cannot be easily understood or explained",
              isCorrect: true,
            },
            { value: "Follows a very predictable pattern", isCorrect: false },
          ],
        },
        {
          question:
            "Which of the following is an example of something unfathomable?",
          options: [
            { value: "A basic math problem", isCorrect: false },
            { value: "The size of the universe", isCorrect: true },
            { value: "The color of the sky on a clear day", isCorrect: false },
            { value: "A well-documented historical event", isCorrect: false },
          ],
        },
        {
          question:
            "If a person's behavior is described as unfathomable, it means that:",
          options: [
            { value: "It is predictable and ordinary", isCorrect: false },
            {
              value: "It is unusual and difficult to understand",
              isCorrect: true,
            },
            {
              value: "It is exemplary and should be followed",
              isCorrect: false,
            },
            { value: "It is consistent and reliable", isCorrect: false },
          ],
        },
        {
          question:
            "The concept of infinity is often considered unfathomable because it is:",
          options: [
            { value: "Easily measured and finite", isCorrect: false },
            { value: "Simple and straightforward", isCorrect: false },
            {
              value: "Beyond human understanding and endless",
              isCorrect: true,
            },
            {
              value: "Not relevant to mathematics or philosophy",
              isCorrect: false,
            },
          ],
        },
        {
          question:
            "In literature, an unfathomable character might be one who:",
          options: [
            { value: "Has no depth or complexity", isCorrect: false },
            { value: "Is very predictable and boring", isCorrect: false },
            {
              value:
                "Has motives or thoughts that are impossible to fully understand",
              isCorrect: true,
            },
            {
              value: "Always acts in a logical and understandable way",
              isCorrect: false,
            },
          ],
        },
        {
          question:
            "A scientific theory that is considered unfathomable would likely be one that:",
          options: [
            {
              value: "Can be easily taught in elementary school",
              isCorrect: false,
            },
            {
              value: "Has been proven wrong by recent experiments",
              isCorrect: false,
            },
            {
              value:
                "Challenges current understanding and is difficult to comprehend",
              isCorrect: true,
            },
            {
              value: "Is universally accepted and well understood",
              isCorrect: false,
            },
          ],
        },
        {
          question:
            "When something is described as unfathomable beauty, it means that the beauty is:",
          options: [
            { value: "Average and not very remarkable", isCorrect: false },
            {
              value: "Unpleasant and displeasing to the eye",
              isCorrect: false,
            },
            {
              value:
                "So extraordinary that it's hard to fully grasp or appreciate",
              isCorrect: true,
            },
            { value: "Very common and seen everywhere", isCorrect: false },
          ],
        },
      ],
    },
  ];

  await WordGameModel.create(
    data.map((d) => ({
      ...d,
      questions: d.questions?.map((q) => ({
        ...q,
        _id: new mongoose.Types.ObjectId(),
        options: q.options.map((o) => ({
          ...o,
          _id: new mongoose.Types.ObjectId(),
        })),
      })),
    }))
  );
};

seed();
