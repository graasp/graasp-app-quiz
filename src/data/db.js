import { MULTIPLE_CHOICE, SLIDER, TEXT_INPUT } from "../components/constants";

const buildDatabase = (appContext) => ({
  appData: [
    /*{
      id: "id",
      data: {
        question: "What is the capital of France?",
        questionType: MULTIPLE_CHOICE,
        choices: [
          { choice: "London", isCorrect: false },
          { choice: "Paris", isCorrect: true },
          { choice: "New York", isCorrect: false },
          { choice: "Tokyo", isCorrect: false },
        ],
      },
      type: "question",
    },*/
    {
      id: "id",
      data: {
        question: "How happy are you?",
        questionType: SLIDER,
        leftText: "Sad",
        rightText: "Happy",
        correctValue: 20,
      },
      type: "question",
    },
    /*{
      id: "id",
      data: {
        question: "What is a baby cat called?",
        questionType: TEXT_INPUT,
        answer: "kitten",
      },
      type: "question",
    }, */
    {
      id: "id2",
      //memberId: '',
      data: {
        answers: [],
      },
      type: "answer",
    },
  ],
  members: [
    {
      id: appContext.memberId,
      name: "mock-member",
    },
  ],
});

export default buildDatabase;
