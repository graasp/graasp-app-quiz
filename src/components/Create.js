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
  const { mutate: postAppData } = useMutation(MUTATION_KEYS.POST_APP_DATA);
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
  // Flag to block useEffect until an operation completes
  //const [update, setUpdate] = useState(true)
  var update = true

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
      console.log("first called")
      console.log(data)
      console.log(questionList)
      // Fetches the database's question list.
      let newQuestionList = getDataWithType(data, QUESTION_LIST_TYPE)?.first()?.data?.list;
      setQuestionList(newQuestionList);
      let newCurrentQuestionId = newQuestionList[currentQuestionIndex];
      setCurrentQuestionId(newCurrentQuestionId);
      // The database data structure of the current question.
      let newCurrentQuestionData = getDataWithId(data, newCurrentQuestionId);
      if (newCurrentQuestionData) {
        setQuestion(newCurrentQuestionData?.data?.question ?? DEFAULT_TEXT);
        let newType = newCurrentQuestionData?.data?.questionType ?? MULTIPLE_CHOICE;
        setType(newType);
        switch (newType) {
          case MULTIPLE_CHOICE: {
            setChoices(newCurrentQuestionData?.data?.choices ?? DEFAULT_CHOICES);
            break;
          }
          case TEXT_INPUT: {
            setText(newCurrentQuestionData?.data?.answer ?? DEFAULT_TEXT);
            break;
          }
          case SLIDER: {
            setSliderLeftText(newCurrentQuestionData?.data?.leftText ?? DEFAULT_TEXT);
            setSliderRightText(newCurrentQuestionData?.data?.rightText ?? DEFAULT_TEXT);
            setSliderCorrectValue(newCurrentQuestionData?.data?.correctValue ?? 0);
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

  useEffect(() => {
    if (newQuestion) {
      console.log("called")
      setNewQuestion(false)
      const id = getDataWithType(data, NEW_QUESTION_TYPE)?.first()?.id
      let newQuestionList = [...questionList];
      const newQuestionIndex = currentQuestionIndex+1
      newQuestionList.splice(newQuestionIndex, 0, id);
      setQuestionList(newQuestionList);
      handleNext(newQuestionList);
    }
  }, [getDataWithType(data, NEW_QUESTION_TYPE)])
  /**
   * Creates a new question and navigates to it.
   */
  const onAddQuestion = () => {
    setNewQuestion(true)
    // Temporary item to be added to the database with a distinct type, in order to fetch its ID upon creation
    postAppData({
      type: NEW_QUESTION_TYPE,
    })
  };

  /**
   * Deletes the current question and navigates to the previous one, or the next one if there are none.
   */
  const deleteQuestion = () => {
    // We do not allow the deletion of all questions of the quiz, there should be at least one visible, but maybe we could add a screen for when no quiz questions have been created.
    if (questionList.length > 1) {
      //deleteAppData({ currentQuestionId }); The question should be deleted from the database as well using a variant of this method.
      let newQuestionList = [...questionList];
      // Deletes current question
      newQuestionList.splice(currentQuestionIndex, 1);
      setQuestionList(newQuestionList);
      handlePrevious(newQuestionList);
    }
  };

  /**
   * 
   * @param {*} newQuestionList 
   */
  const handleNext = (newQuestionList) => {
    handleSave(newQuestionList);
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
  const handlePrevious = (newQuestionList) => {
    handleSave(newQuestionList);
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  /**
   * 
   * @param {*} qList 
   */
  const handleSave = (qList) => {
    let questionListDBId = getDataWithType(data, QUESTION_LIST_TYPE)?.first()?.id
    if (questionListDBId) {
      patchAppData({
        id: questionListDBId,
        data: {
          list: qList ?? questionList,
        },
        type: QUESTION_LIST_TYPE,
      });
    }
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
        } else {
          postAppData({
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
        } else {
          if (currentQuestionId) {
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
        } else {
          if (currentQuestionId) {
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
            <Button variant="contained" color="info" onClick={() => handlePrevious()}>
              Prev
            </Button>
          </Grid>
          <Grid item>
            <Button
              color="error"
              variant="contained"
              startIcon={<DeleteIcon />}
              onClick={deleteQuestion}
            >
              Delete
            </Button>
          </Grid>
          <Grid item>
            <Button
              onClick={() => handleSave()}
              variant="contained"
              color="success"
            >
              Save
            </Button>
          </Grid>
          <Grid item>
            <Button variant="contained" color="info" onClick={() => handleNext()}>
              Next
            </Button>
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
}

export default Create;
