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
  QUESTION_LIST_TYPE,
  NEW_QUESTION_TYPE,
} from "./constants";
import { useAppData } from "./context/hooks";
import { getDataWithId, getDataWithType } from "./context/utilities";
import { MUTATION_KEYS, useMutation } from "../config/queryClient";
import MultipleChoice from "./MultipleChoice";
import TextInput from "./TextInput";
import Slider from "./Slide";
import DeleteIcon from "@mui/icons-material/Delete";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import QuestionTopBar from "./QuestionTopBar";

function Create() {

  const { data } = useAppData();
  const { mutate: postAppData } = useMutation(MUTATION_KEYS.POST_APP_DATA);
  const { mutate: patchAppData } = useMutation(MUTATION_KEYS.PATCH_APP_DATA);
  const [currentQuestionIndex, setCurrentQuestionIndex] = React.useState(0);
  const [questionList, setQuestionList] = useState([]);
  const [currentQuestionId, setCurrentQuestionId] = useState(null);
  const [currentQuestionData, setCurrentQuestionData] = useState(null);
  const questionListData = getDataWithType(data, QUESTION_LIST_TYPE)?.get(0)

  const [question, setQuestion] = useState(DEFAULT_TEXT);
  const [type, setType] = useState(MULTIPLE_CHOICE);
  const [generatedId, setGeneratedId] = useState(5)

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
      console.log(data)
      let newQuestionList = questionListData?.data?.list
      setQuestionList(newQuestionList);
      let newCurrentQuestionId = newQuestionList[currentQuestionIndex]
      setCurrentQuestionId(newCurrentQuestionId);
      let newCurrentQuestionData = getDataWithId(data, newCurrentQuestionId)
      setCurrentQuestionData(newCurrentQuestionData)
      if (newCurrentQuestionData) {
        setQuestion(newCurrentQuestionData?.data?.question)
        let newType = newCurrentQuestionData?.data?.questionType
        setType(newType)
        switch (newType) {
          case MULTIPLE_CHOICE: {
            setChoices(newCurrentQuestionData?.data?.choices)
            break;
          }
          case TEXT_INPUT: {
            setText(newCurrentQuestionData?.data?.answer)
            break;
          }
          case SLIDER: {
            setSLT(newCurrentQuestionData?.data?.leftText)
            setSRT(newCurrentQuestionData?.data?.rightText)
            setSliderCorrectValue(newCurrentQuestionData?.data?.correctValue)
            break;
          }
        }
      } else {
        setQuestion(DEFAULT_TEXT)
        setType(MULTIPLE_CHOICE)
        setChoices(DEFAULT_CHOICES)
        setText(DEFAULT_TEXT)
        setSLT(DEFAULT_TEXT)
        setSRT(DEFAULT_TEXT)
        setSliderCorrectValue(0)
      }
    }
  }, [data, currentQuestionIndex]);

  const generateId = () => {
    setGeneratedId(generatedId+1)
    return `${generatedId}`; // can be made asynchronous
  };

  const onAddQuestion = () => {
    let newQuestionList = [...questionList];
    // uncomment when using real database:
    /*
    postAppData({
      type: NEW_QUESTION_TYPE
    })
    const id = getDataWithType(data, NEW_QUESTION_TYPE)?.get(0)?.id
    newQuestionList.splice(currentQuestionIndex, 0, id);
    */
    newQuestionList.splice(currentQuestionIndex, 0, generateId()); // comment when using real database
    setQuestionList(newQuestionList);
    onSave(newQuestionList)
    console.log(newQuestionList)
  };

  const onDeleteQuestion = () => {
    if (questionList.length > 1) {
      let newQuestionList = [...questionList];
      newQuestionList.splice(currentQuestionIndex, 1);
      setQuestionList(newQuestionList);
      onSave(newQuestionList)
      onPrev()
    }
  };

  const onNext = () => {
    onSave()
    if (currentQuestionIndex+1 < questionList.length) {
      setCurrentQuestionIndex(currentQuestionIndex+1)
    }
  };

  const onPrev = () => {
    onSave()
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex-1)
    }
  }

  const onSave = (qList) => {
    patchAppData({
      id: questionListData?.id,
      data: {
        list: qList ? qList : questionList,
      },
      type: QUESTION_LIST_TYPE,
    });
    switch (type) {
      case MULTIPLE_CHOICE: {
        //patch
        if (questionList.length == 0) {
          postAppData({
            data: {
              question: question,
              questionType: MULTIPLE_CHOICE,
              choices: choices,
            },
            type: QUESTION_TYPE,
          });
        } else {
          patchAppData({
            id: questionList[currentQuestionIndex],
            data: {
              question: question,
              questionType: MULTIPLE_CHOICE,
              choices: choices,
            },
            type: QUESTION_TYPE,
          });
        }
        break;
      }
      case TEXT_INPUT: {
        if (questionList.length == 0){
          postAppData({
            data: {
              question: question,
              questionType: TEXT_INPUT,
              answer: text,
            },
            type: QUESTION_TYPE,
          });
        } else {
          patchAppData({
            id: questionList[currentQuestionIndex],
            data: {
              question: question,
              questionType: TEXT_INPUT,
              answer: text,
            },
            type: QUESTION_TYPE,
          });
        }
        break;
      }
      case SLIDER: {
        if (questionList.length == 0){
          postAppData({
            data: {
              question: question,
              questionType: SLIDER,
              leftText: sliderLeftText,
              rightText: sliderRightText,
              correctValue: sliderCorrectValue,
            },
            type: QUESTION_TYPE,
          });
        } else {
          patchAppData({
            id: questionList[currentQuestionIndex],
            data: {
              question: question,
              questionType: SLIDER,
              leftText: sliderLeftText,
              rightText: sliderRightText,
              correctValue: sliderCorrectValue,
            },
            type: QUESTION_TYPE,
          });
        }
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
            onAddQuestion={onAddQuestion}
          />
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
                <MultipleChoice choices={choices} setChoices={setChoices} currentQuestionData={currentQuestionData}/>
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
            <Button variant="contained" color="info" onClick={onPrev}>
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
            <Button onClick={() => {onSave()}} variant="contained" color="success">
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
