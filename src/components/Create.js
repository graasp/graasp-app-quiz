import {
  TextField,
  Grid,
  Box,
  InputLabel,
  MenuItem,
  FormControl,
  Button,
  Typography,
  Select,
} from "@mui/material";
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
  CREATE,
} from "./constants";
import { useAppData } from "./context/hooks";
import { getDataWithId, getDataWithType } from "./context/utilities";
import { MUTATION_KEYS, useMutation } from "../config/queryClient";
import MultipleChoice from "./MultipleChoice";
import TextInput from "./TextInput";
import Slider from "./Slide";
import DeleteIcon from "@mui/icons-material/Delete";
import QuestionTopBar from "./QuestionTopBar";

function Create() {
  const { data } = useAppData();
  const { mutateAsync: postAppData } = useMutation(MUTATION_KEYS.POST_APP_DATA);
  const { mutate: patchAppData } = useMutation(MUTATION_KEYS.PATCH_APP_DATA);
  const { mutate: deleteAppData } = useMutation(MUTATION_KEYS.DELETE_APP_DATA);
  
  const [questionList, setQuestionList] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = React.useState(0);
  const [currentQuestionId, setCurrentQuestionId] = useState(null);
  // Flag to indictate whether the current question is a new one, ie. not present in the database. Unused when using the real database
  const [newQuestion, setNewQuestion] = useState(false);

  const screenType = CREATE;
  const [question, setQuestion] = useState(DEFAULT_TEXT);
  const [type, setType] = useState(MULTIPLE_CHOICE);

  const [choices, setChoices] = useState(DEFAULT_CHOICES);
  const [text, setText] = useState(DEFAULT_TEXT);
  const [sliderLeftText, setSliderLeftText] = useState(DEFAULT_TEXT);
  const [sliderRightText, setSliderRightText] = useState(DEFAULT_TEXT);
  const [sliderCorrectValue, setSliderCorrectValue] = useState(0);

  /**
   * Sets the {type} parameter to the dropdown menu's selected question type.
   * 
   * @param {object} event The question type menu change event.
   */
  const handleTypeSelect = (event) => {
    setType(event.target.value);
  };

  useEffect(() => {
    // Initializes multiple quiz creation screen parameters to their current database values once the database's app data is fetched, or once the current question's index changes (ie. the user navigates to another question).
    if (data) {
      // Fetches the database's question list.
      let newQuestionList = getDataWithType(data, QUESTION_LIST_TYPE)?.first()?.data?.list;
      setQuestionList(newQuestionList);
      let newCurrentQuestionId = newQuestionList[currentQuestionIndex];
      setCurrentQuestionId(newCurrentQuestionId);
      // The database data structure of the current question.
      let newCurrentQuestionData = getDataWithId(data, newCurrentQuestionId);
      if (newCurrentQuestionData) {
        setQuestion(newCurrentQuestionData?.data?.question);
        let newType = newCurrentQuestionData?.data?.questionType;
        setType(newType);
        switch (newType) {
          case MULTIPLE_CHOICE: {
            setChoices(newCurrentQuestionData?.data?.choices);
            break;
          }
          case TEXT_INPUT: {
            setText(newCurrentQuestionData?.data?.answer);
            break;
          }
          case SLIDER: {
            setSliderLeftText(newCurrentQuestionData?.data?.leftText);
            setSliderRightText(newCurrentQuestionData?.data?.rightText);
            setSliderCorrectValue(newCurrentQuestionData?.data?.correctValue);
            break;
          }
        }
      } else {
        setQuestion(DEFAULT_TEXT);
        setType(MULTIPLE_CHOICE);
        setChoices(DEFAULT_CHOICES);
        setText(DEFAULT_TEXT);
        setSliderLeftText(DEFAULT_TEXT);
        setSliderRightText(DEFAULT_TEXT);
        setSliderCorrectValue(0);
      }
    }
  }, [data, currentQuestionIndex]);

  /**
   * Creates a new question and navigates to it.
   */
  const onAddQuestion = async () => {
    const {id: newAppDataId} = await postAppData({
      data: {
        question: '',
        questionType: MULTIPLE_CHOICE,
        choices: DEFAULT_CHOICES,
      },
      type: QUESTION_TYPE,
    })
    let newQuestionList = [...questionList];
    // Temporary item to be added to the database with a distinct type, in order to fetch its ID upon cre
    //console.log(newAppDataId)
    //const id = getDataWithType(data, NEW_QUESTION_TYPE)?.first()?.id
    const newQuestionIndex = currentQuestionIndex+1
    newQuestionList.splice(newQuestionIndex, 0, newAppDataId);
    setQuestionList(newQuestionList);
    onNext(newQuestionList);
    setNewQuestion(true); // delete newQuestion flag when using real db
  };

  /**
   * Deletes the current question and navigates to the previous one, or the next one if there are none.
   */
  const onDeleteQuestion = () => {
    if (questionList.length > 1) {
      deleteAppData({ currentQuestionId });
      let newQuestionList = [...questionList];
      newQuestionList.splice(currentQuestionIndex, 1);
      setQuestionList(newQuestionList);
      onPrev(newQuestionList);
    }
  };

  /**
   * 
   * @param {*} newQuestionList 
   */
  const onNext = (newQuestionList) => {
    onSave(newQuestionList);
    const questionListLength = newQuestionList
      ? newQuestionList.length
      : questionList.length;
    if (currentQuestionIndex + 1 < questionListLength) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  /**
   * 
   * @param {*} newQuestionList 
   */
  const onPrev = (newQuestionList) => {
    onSave(newQuestionList);
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  /**
   * 
   * @param {*} qList 
   */
  const onSave = (qList) => {
    patchAppData({
      id: getDataWithType(data, QUESTION_LIST_TYPE)?.first()?.id,
      data: {
        list: qList ? qList : questionList,
      },
      type: QUESTION_LIST_TYPE,
    });
    switch (type) {
      case MULTIPLE_CHOICE: {
        if (questionList.length == 0) {
          postAppData({
            data: {
              question: question,
              questionType: MULTIPLE_CHOICE,
              choices: choices,
            },
            type: QUESTION_TYPE,
          });
          setNewQuestion(false);
        } else {
          patchAppData({
            id: currentQuestionId,
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
        if (questionList.length == 0 || newQuestion) {
          postAppData({
            data: {
              question: question,
              questionType: TEXT_INPUT,
              answer: text,
            },
            type: QUESTION_TYPE,
          });
          setNewQuestion(false);
        } else {
          patchAppData({
            id: currentQuestionId,
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
        if (questionList.length == 0 || newQuestion) {
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
          setNewQuestion(false);
        } else {
          patchAppData({
            id: currentQuestionId,
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
                  setLeftText={setSliderLeftText}
                  rightText={sliderRightText}
                  setRightText={setSliderRightText}
                  sliderCorrectValue={sliderCorrectValue}
                  setSliderCorrectValue={setSliderCorrectValue}
                  currentQuestion={currentQuestionIndex}
                />
              );
            }
            default:
              return (
                <MultipleChoice
                  choices={choices}
                  setChoices={setChoices}
                />
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
            <Button variant="contained" color="info" onClick={() => onPrev()}>
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
            <Button
              onClick={() => onSave()}
              variant="contained"
              color="success"
            >
              Save
            </Button>
          </Grid>
          <Grid item>
            <Button variant="contained" color="info" onClick={() => onNext()}>
              Next
            </Button>
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
}

export default Create;
