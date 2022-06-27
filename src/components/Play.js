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
  DEFAULT_CHOICE,
  APP_DATA_TYPE,
  MULTIPLE_CHOICE,
  TEXT_INPUT,
  SLIDER,
  QUESTION_TYPE,
  QUESTION_LIST_TYPE,
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
  const [currentQuestion, setCurrentQuestion] = React.useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = React.useState(0);
  const [questionList, setQuestionList] = useState([]);
  const [currentQuestionId, setCurrentQuestionId] = useState(null);
  const [currentQuestionData, setCurrentQuestionData] = useState(null);
  const questionListData = getDataWithType(data, QUESTION_LIST_TYPE)?.get(0)
  const [qid, setQid] = useState(2);

  const question = data?.get(qid)?.data?.question;
  const type = data?.get(qid)?.data?.questionType;
  const choices = data?.get(qid)?.data?.choices;
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
  const answer = data?.get(qid)?.data?.answer;
  const [sliderValue, setSliderValue] = React.useState(0);
  const sliderCorrectValue = data?.get(qid)?.data?.correctValue;
  const [submitted, setSubmitted] = React.useState(false);

  useEffect(() => {
    if (data) {
      let newQuestionList = questionListData?.data?.list
      setQuestionList(newQuestionList);
      let newCurrentQuestionId = newQuestionList[currentQuestionIndex]
      setCurrentQuestionId(newCurrentQuestionId);
      let newCurrentQuestionData = getDataWithId(data, newCurrentQuestionId)
      setCurrentQuestionData(newCurrentQuestionData)
    }
  }, [data, currentQuestionIndex]);

  const onSkip = () => {
    if (qid === 2) {
      setQid(0);
    } else {
      setQid(qid + 1);
    }
    setSubmitted(false);
  };

  const onSubmit = () => {
    setSubmitted(true); // TODO: if statement post / patch based on memberID
    /*
    switch (type) {
      case MULTIPLE_CHOICE: {
        postAppData({
          id: data?.get(3).id,
          data: {
            questionType: MULTIPLE_CHOICE,
            answers: answers,
          },
          type: "answer",
        });
      }
      case TEXT_INPUT: {
        postAppData({
          id: data?.get(3).id,
          data: {
            questionType: TEXT_INPUT,
            answer: text,
          },
          type: "answer",
        });
      }
      case SLIDER: {
        postAppData({
          id: data?.get(3).id,
          data: {
            questionType: SLIDER,
            value: sliderValue,
          },
          type: "answer",
        });
      }
    }*/
  };

  return (
    <div align="center">
      <Grid container direction={"row"} alignItems="center" justifyContent="center" sx={{ p: 2 }}>
        <Grid item>
          <QuestionTopBar
            currentQuestionIndex={currentQuestionIndex}
            setCurrentQuestionIndex={setCurrentQuestionIndex}
            questionList={questionList}
            setQuestionList={setQuestionList}
          />
        </Grid>
      </Grid>
      <Typography variant="h1" fontSize={45} sx={{ pb: 4 }}>
        {question}
      </Typography>
      {(() => {
        switch (type) {
          case MULTIPLE_CHOICE: {
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
          case TEXT_INPUT: {
            return (
              <PlayTextInput
                text={text}
                setText={setText}
                answer={answer}
                submitted={submitted}
              />
            );
          }
          case SLIDER: {
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
            Submit
          </Button>
        </Grid>
        <Grid item>
          <Button variant="contained" color="info" onClick={onSkip}>
            Skip
          </Button>
        </Grid>
      </Grid>
    </div>
  );
}

export default Play;
