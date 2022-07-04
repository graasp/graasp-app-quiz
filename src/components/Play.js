import {
  TextField,
  Fab,
  Grid,
  InputLabel,
  OutlinedInput,
  IconButton,
  InputAdornment,
  FormControl,
  FormControlLabel,
  Button,
  Checkbox,
  Typography,
  Stepper,
  Step,
  StepLabel,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import {
  DEFAULT_TEXT,
  DEFAULT_CHOICES,
  SCREEN_TYPES,
  APP_DATA_TYPES,
} from "./constants";
import { useAppData } from "./context/hooks";
import { MUTATION_KEYS, useMutation } from "../config/queryClient";
import { HdrOnSelectRounded } from "@mui/icons-material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { getDataWithId, getDataWithType } from "./context/utilities";
import PlayMultipleChoice from "./PlayMultipleChoice";
import PlayTextInput from "./PlayTextInput";
import PlaySlider from "./PlaySlider";
import QuestionTopBar from "./QuestionTopBar";

function Play() {
  const { data, isSuccess } = useAppData();
  const { mutate: postAppData } = useMutation(MUTATION_KEYS.POST_APP_DATA);
  const [questionList, setQuestionList] = useState([]);
  const questionListData = getDataWithType(
    data,
    APP_DATA_TYPES.QUESTION_LIST
  )?.get(0);
  const [question, setQuestion] = React.useState(DEFAULT_TEXT);
  const [currentQuestionIndex, setCurrentQuestionIndex] = React.useState(0);
  const [currentQuestionId, setCurrentQuestionId] = useState(null);
  const [currentQuestionData, setCurrentQuestionData] = useState(null);
  const screenType = SCREEN_TYPES.PLAY;

  const [type, setType] = useState(QUESTION_TYPES.MULTIPLE_CHOICE);
  const [choices, setChoices] = useState(DEFAULT_CHOICES);
  const [answer, setAnswer] = useState(DEFAULT_TEXT);
  const [sliderCorrectValue, setSliderCorrectValue] = useState(0);

  const [answers, setAnswers] = React.useState(
    Array(choices?.length)
      .fill()
      .map(() => false)
  );
  const [results, setResults] = React.useState(
    Array(choices?.length)
      .fill()
      .map(() => "neutral")
  );
  const [text, setText] = React.useState(DEFAULT_TEXT);
  const [sliderValue, setSliderValue] = React.useState(0);
  const [submitted, setSubmitted] = React.useState(false);
  const [completedQuestions, setCompletedQuestions] = React.useState(
    Array(questionList.length)
      .fill()
      .map(() => false)
  );
  const [viewedQuestions, setViewedQuestions] = React.useState(
    Array(questionList.length)
      .fill()
      .map(() => false)
  );

  useEffect(() => {
    if (data) {
      viewQuestion();
      setSubmitted(completedQuestions[currentQuestionIndex]);
      let newQuestionList = questionListData?.data?.list;
      setQuestionList(newQuestionList);
      let newCurrentQuestionId = newQuestionList[currentQuestionIndex];
      setCurrentQuestionId(newCurrentQuestionId);
      let newCurrentQuestionData = getDataWithId(data, newCurrentQuestionId);
      setCurrentQuestionData(newCurrentQuestionData);
      if (newCurrentQuestionData) {
        setQuestion(newCurrentQuestionData?.data?.question);
        let newType = newCurrentQuestionData?.data?.questionType;
        setType(newType);
        switch (newType) {
          case QUESTION_TYPES.MULTIPLE_CHOICE: {
            setChoices(newCurrentQuestionData?.data?.choices);
            break;
          }
          case QUESTION_TYPES.TEXT_INPUT: {
            setAnswer(newCurrentQuestionData?.data?.answer);
            break;
          }
          case QUESTION_TYPES.SLIDER: {
            setSliderCorrectValue(newCurrentQuestionData?.data?.correctValue);
            break;
          }
        }
      } else {
        setQuestion(DEFAULT_TEXT);
        setType(QUESTION_TYPES.MULTIPLE_CHOICE);
        setChoices(DEFAULT_CHOICES);
        setAnswer(DEFAULT_TEXT);
        setSliderCorrectValue(0);
      }
    }
  }, [data, currentQuestionIndex]);

  const onNext = () => {
    if (currentQuestionIndex + 1 < questionList.length) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
    setSubmitted(false);
  };

  const isLastQuestion = () => {
    return currentQuestionIndex === questionList.length - 1;
  };

  const completeQuestion = () => {
    let newCompletedQuestions = completedQuestions;
    newCompletedQuestions[currentQuestionIndex] = true;
    setCompletedQuestions(newCompletedQuestions);
  };

  const viewQuestion = () => {
    let newViewedQuestions = viewedQuestions;
    newViewedQuestions[currentQuestionIndex] = true;
    setViewedQuestions(newViewedQuestions);
  };

  const getMiddleButtonText = () => {
    return isLastQuestion() ? "Finish" : "Submit";
  };

  const getRightButtonText = () => {
    return submitted ? "Next" : "Skip";
  };

  const onSubmit = () => {
    if (!completedQuestions[currentQuestionIndex]) {
      setSubmitted(true);
      completeQuestion();
      switch (type) {
        case QUESTION_TYPES.MULTIPLE_CHOICE: {
          postAppData({
            questionID: currentQuestionId,
            data: {
              questionType: QUESTION_TYPES.MULTIPLE_CHOICE,
              answers: answers,
            },
            type: APP_DATA_TYPES.ANSWER,
          });
          break;
        }
        case QUESTION_TYPES.TEXT_INPUT: {
          postAppData({
            questionID: currentQuestionId,
            data: {
              questionType: QUESTION_TYPES.TEXT_INPUT,
              answer: text,
            },
            type: APP_DATA_TYPES.ANSWER,
          });
          break;
        }
        case QUESTION_TYPES.SLIDER: {
          postAppData({
            questionID: currentQuestionId,
            data: {
              questionType: QUESTION_TYPES.SLIDER,
              value: sliderValue,
            },
            type: APP_DATA_TYPES.ANSWER,
          });
          break;
        }
      }
    }
  };

  return (
    <div align="center">
      <Grid
        container
        direction={"row"}
        alignItems="center"
        justifyContent="center"
        sx={{ p: 2 }}
      >
        <Grid item>
          <QuestionTopBar
            screenType={screenType}
            currentQuestionIndex={currentQuestionIndex}
            setCurrentQuestionIndex={setCurrentQuestionIndex}
            questionList={questionList}
            completedQuestions={completedQuestions}
            viewedQuestions={viewedQuestions}
          />
        </Grid>
      </Grid>
      <Typography variant="h1" fontSize={45} sx={{ pb: 4 }}>
        {question}
      </Typography>
      {(() => {
        switch (type) {
          case QUESTION_TYPES.MULTIPLE_CHOICE: {
            return (
              <PlayMultipleChoice
                choices={choices}
                answers={answers}
                setAnswers={setAnswers}
                results={results}
                setResults={setResults}
                submitted={submitted}
                setSubmitted={setSubmitted}
              />
            );
          }
          case QUESTION_TYPES.TEXT_INPUT: {
            return (
              <PlayTextInput
                text={text}
                setText={setText}
                answer={answer}
                submitted={submitted}
              />
            );
          }
          case QUESTION_TYPES.SLIDER: {
            return (
              <PlaySlider
                sliderValue={sliderValue}
                setSliderValue={setSliderValue}
                sliderCorrectValue={sliderCorrectValue}
                submitted={submitted}
              />
            );
          }
          default:
            return (
              <PlayMultipleChoice
                choices={choices}
                answers={answers}
                setAnswers={setAnswers}
                results={results}
                setResults={setResults}
                submitted={submitted}
                setSubmitted={setSubmitted}
              />
            );
        }
      })()}
      <Grid
        container
        direction={"row"}
        spacing={2}
        sx={{ pt: 2 }}
        alignItems="center"
      >
        <Grid item sx={{ pr: 20 }}>
          <Button variant="contained" color="info">
            Leave
          </Button>
        </Grid>
        <Grid item sx={{ pr: 20 }}>
          <Button onClick={onSubmit} variant="contained" color="success">
            {getMiddleButtonText()}
          </Button>
        </Grid>
        <Grid item>
          {!isLastQuestion() ? (
            <Button variant="contained" color="info" onClick={onNext}>
              {getRightButtonText()}
            </Button>
          ) : null}
        </Grid>
      </Grid>
    </div>
  );
}

export default Play;
