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
import React, { useState, useEffect } from "react";
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
import { useAppData, getDataWithId } from "./context/hooks";
import { MUTATION_KEYS, useMutation } from "../config/queryClient";
import MultipleChoice from "./MultipleChoice";
import TextInput from "./TextInput";
import Slider from "./Slide";
import DeleteIcon from "@mui/icons-material/Delete";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import QuestionTopBar from "./QuestionTopBar";

function Create() {
  const buttonTheme = createTheme({
    palette: {
      secondary: {
        main: "#000000",
      },
    },
  });

  const buttonStyle = {
    maxHeight: "23px",
    minHeight: "23px",
    minWidth: "23px",
    maxWidth: "23px",
  };

  const addStyle = {
    maxHeight: "20px",
    minHeight: "20px",
    minWidth: "20px",
    maxWidth: "20px",
  };

  const { data } = useAppData();
  const { mutate: postAppData } = useMutation(MUTATION_KEYS.POST_APP_DATA);
  const [currentQuestionIndex, setCurrentQuestionIndex] = React.useState(0);

  const [question, setQuestion] = useState(DEFAULT_TEXT);
  const [type, setType] = useState(MULTIPLE_CHOICE);
  var id = 5;
  const [questionList, setQuestionList] = useState(data?.get(0)?.data?.list);
  const [currentQuestionId, setCurrentQuestionId] = useState(
    questionList ? questionList[currentQuestionIndex] : null
  );
  const currentQuestionData = getDataWithId(currentQuestionId);

  const [choices, setChoices] = useState(DEFAULT_CHOICES);
  const [text, setText] = useState(DEFAULT_TEXT);
  const [sliderLeftText, setSLT] = useState(DEFAULT_TEXT);
  const [sliderRightText, setSRT] = useState(DEFAULT_TEXT);
  const [sliderCorrectValue, setSliderCorrectValue] = useState(0);
  const [qid, setQid] = useState(0);

  const handleTypeSelect = (event) => {
    setType(event.target.value);
  };

  useEffect(() => {
    if (data) {
      setQuestionList(data?.get(0)?.data?.list);
    }
  }, [data]);

  const generateId = () => {
    return `${id++}`; // can be made asynchronous
  };

  const onAddQuestion = () => {
    let newQuestionList = [...questionList];
    newQuestionList.splice(currentQuestionIndex, 0, generateId());
    setQuestionList(newQuestionList);
  };

  const onDeleteQuestion = () => {
    let newQuestionList = [...questionList];
    newQuestionList.splice(currentQuestionIndex, 1);
    setQuestionList(newQuestionList);
  };

  const onNext = () => {
    if (qid === 2) {
      setQid(0);
    } else {
      setQid(qid + 1);
    }
  };

  const onSave = () => {
    switch (type) {
      case MULTIPLE_CHOICE: {
        //patch
        postAppData({
          id: questionList ? questionList[currentQuestionIndex] : generateId(),
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
          id: questionList ? questionList[currentQuestionIndex] : generateId(),
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
          id: questionList ? questionList[currentQuestionIndex] : generateId(),
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
  // useEffect always
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
        <Grid item>
          <ThemeProvider theme={buttonTheme}>
            <Fab
              color="primary"
              aria-label="add"
              justify="center"
              style={buttonStyle}
              onClick={onAddQuestion}
            >
              <AddIcon style={addStyle} />
            </Fab>
          </ThemeProvider>
        </Grid>
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
                <MultipleChoice
                  choices={choices}
                  setChoices={setChoices}
                  currentQuestionData={currentQuestionData}
                />
              );
            }
            case TEXT_INPUT: {
              return (
                <TextInput
                  text={text}
                  setText={setText}
                  currentQuestion={currentQuestionIndex}
                />
              );
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
                  currentQuestion={currentQuestionIndex}
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
          spacing={4}
          sx={{ py: 2 }}
          align="center"
        >
          <Grid item>
            <Button variant="contained" color="info">
              Prev
            </Button>
          </Grid>
          <Grid item>
            <Button
              color="error"
              variant="contained"
              startIcon={<DeleteIcon />}
              onClick={onDeleteQuestion}
            >
              Delete
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
