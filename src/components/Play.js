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
} from "./constants";
import { useAppData } from "./context/hooks";
import { MUTATION_KEYS, useMutation } from "../config/queryClient";
import { HdrOnSelectRounded } from "@mui/icons-material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import PlayMultipleChoice from "./PlayMultipleChoice";
import PlayTextInput from "./PlayTextInput";
import PlaySlider from "./PlaySlider";

function Play() {
  const { data, isSuccess } = useAppData();
  const { mutate: postAppData } = useMutation(MUTATION_KEYS.POST_APP_DATA);

  const question = data?.get(0)?.data?.question;
  const type = data?.get(0)?.data?.questionType;
  const choices = data?.get(0)?.data?.choices;
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
  const [text, setText] = React.useState(DEFAULT_TEXT)
  const answer = data?.get(0)?.data?.answer;
  const [sliderValue, setSliderValue] = React.useState(0)
  const [submitted, setSubmitted] = React.useState(false);
/*
  useEffect(() => {
    if (data) {
      setResults(data);
    }
  }, [data]);*/

  const onSubmit = () => {
    setSubmitted(!submitted); // TODO: if statement post / patch based on memberID
    postAppData({
      id: data?.get(1).id,
      data: {
        answers: answers,
      },
      type: "answer",
    });
    let newResults = [];
    for (let i = 0; i < results.length; i++) {
      newResults[i] = computeCorrectness(i);
    }
    setResults(newResults);
  };

  return (
    <div>
      <Grid container direction={"column"} alignItems="center" sx={{ p: 2 }}>
        <Stepper alternativeLabel activeStep={1}>
          <Step completed>
            <StepLabel>Question 1</StepLabel>
          </Step>
          <Step>
            <StepLabel>Question 2</StepLabel>
          </Step>
          <Step>
            <StepLabel>Question 3</StepLabel>
          </Step>
        </Stepper>
      </Grid>
      <Typography variant="h1" fontSize={45} sx={{ pb: 4 }}>
        {question}
      </Typography>
      {
          (() => {
              switch(type) {
                case MULTIPLE_CHOICE: {
                return <PlayMultipleChoice choices={choices} answers={answers} setAnswers={setAnswers} results={results} setResults={setResults} submitted={submitted} setSubmitted={setSubmitted} />;
                }
                case TEXT_INPUT: {
                return <PlayTextInput text={text} setText={setText} answer={answer} />;
                }
                case SLIDER: {
                return <PlaySlider sliderValue={sliderValue} setSliderValue={setSliderValue} />;
                }
                default: return <PlayMultipleChoice choices={choices} answers={answers} setAnswers={setAnswers} results={results} setResults={setResults} submitted={submitted} setSubmitted={setSubmitted} />;
              }
            })()
            }
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
          <Button variant="contained" color="info">
            Skip
          </Button>
        </Grid>
      </Grid>
    </div>
  );
}

export default Play;
