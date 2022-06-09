import {
  TextField,
  Fab,
  Grid,
  Box,
  InputLabel,
  OutlinedInput,
  IconButton,
  MenuItem,
  InputAdornment,
  FormControl,
  FormControlLabel,
  Button,
  Checkbox,
  Typography,
  Stepper,
  Step,
  StepLabel,
  Select,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import React, { useState } from "react";
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
import MultipleChoice from "./MultipleChoice";
import TextInput from "./TextInput";
import Slider from "./Slide";

function Create() {
  const { data } = useAppData();
  const { mutate: postAppData } = useMutation(MUTATION_KEYS.POST_APP_DATA);

  const [question, setQuestion] = useState(DEFAULT_TEXT);
  const [type, setType] = useState(MULTIPLE_CHOICE);

  const [choices, setChoices] = useState(DEFAULT_CHOICES);
  const [text, setText] = useState(DEFAULT_TEXT);
  const [sliderLeftText, setSLT] = useState(DEFAULT_TEXT);
  const [sliderRightText, setSRT] = useState(DEFAULT_TEXT);
  const [sliderCorrectValue, setSliderCorrectValue] = useState(0)
  const [qid, setQid] = useState(0)

  const handleTypeSelect = (event) => {
    setType(event.target.value);
  };

  const onNext = () => {
    if (qid === 2) {
      setQid(0)
    } else {
      setQid(qid+1)
    }
  }

  const onSave = () => {
    switch (type) {
      case MULTIPLE_CHOICE: {
        postAppData({
          id: data?.get(qid).id,
          data: {
            question: question,
            questionType: MULTIPLE_CHOICE,
            choices: choices,
          },
          type: QUESTION_TYPE,
        });
        break;
      }
      case TEXT_INPUT: {
        postAppData({
          id: data?.get(qid).id,
          data: {
            question: question,
            questionType: TEXT_INPUT,
            answer: text,
          },
          type: QUESTION_TYPE,
        });
        break;
      }
      case SLIDER: {
        postAppData({
          id: data?.get(qid).id,
          data: {
            question: question,
            questionType: SLIDER,
            leftText: sliderLeftText,
            rightText: sliderRightText,
            correctValue: sliderCorrectValue,
          },
          type: QUESTION_TYPE,
        });
        break;
      }
    }
  };
  return (
    <div align="center">
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
      <Typography variant="h1" fontSize={40} sx={{ pb: 4 }}>
        Create your quiz
      </Typography>
      <Grid
        container
        direction={"column"}
        align="left"
        columns={{ xs: 12, sm: 12, md: 12, lg: 12, xl: 12 }}
      >
        <Grid item sx={{ pb: 2 }}>
          <Box sx={{ minWidth: 120 }}>
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">Type</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={type}
                label="Type"
                onChange={handleTypeSelect}
              >
                <MenuItem value={MULTIPLE_CHOICE}>Multiple Choice</MenuItem>
                <MenuItem value={TEXT_INPUT}>Text Input</MenuItem>
                <MenuItem value={SLIDER}>Slider</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Grid>
        <Grid item sx={{ pb: 2 }}>
          <Typography variant="p1"> Question:</Typography>
        </Grid>
        <Grid item sx={{ pb: 2 }}>
          <TextField
            value={question}
            placeholder="Enter Question"
            label="Question"
            name="quizQuestion"
            variant="outlined"
            onChange={(t) => {
              setQuestion(t.target.value);
            }}
          />
        </Grid>
        {(() => {
          switch (type) {
            case MULTIPLE_CHOICE: {
              return (
                <MultipleChoice choices={choices} setChoices={setChoices} />
              );
            }
            case TEXT_INPUT: {
              return <TextInput text={text} setText={setText} />;
            }
            case SLIDER: {
              return (
                <Slider
                  leftText={sliderLeftText}
                  setLeftText={setSLT}
                  rightText={sliderRightText}
                  setRightText={setSRT}
                  sliderCorrectValue={sliderCorrectValue}
                  setSliderCorrectValue={setSliderCorrectValue}
                />
              );
            }
            default:
              return (
                <MultipleChoice choices={choices} setChoices={setChoices} />
              );
          }
        })()}
        <Grid
          container
          direction={"row"}
          spacing={8}
          sx={{ py: 2 }}
          align="center"
        >
          <Grid item>
            <Button variant="contained" color="info">
              Prev
            </Button>
          </Grid>
          <Grid item>
            <Button onClick={onSave} variant="contained" color="success">
              Save
            </Button>
          </Grid>
          <Grid item>
            <Button variant="contained" color="info" onClick={onNext}>
              Next
            </Button>
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
}

export default Create;
