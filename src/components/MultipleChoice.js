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
  Select,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import { question, setQuestion } from "./Create.js";
import React, { useState } from "react";
import {
  DEFAULT_TEXT,
  DEFAULT_CHOICES,
  DEFAULT_CHOICE,
  APP_DATA_TYPE,
} from "./constants";

function MultipleChoice({ choices, setChoices, currentQuestionData }) {
  const dataChoices = currentQuestionData?.choices;

  const handleAnswerCorrectnessChange = (index, e) => {
    let newChoices = [...choices];
    newChoices[index] = { ...choices[index], isCorrect: e.target.checked };
    setChoices(newChoices);
  };

  const handleChoiceChange = (index, e) => {
    let newChoices = [...choices];
    newChoices[index] = { ...choices[index], choice: e.target.value };
    setChoices(newChoices);
  };

  const addAnswer = () => {
    setChoices([...choices, DEFAULT_CHOICE]);
  };

  const removeAnswer = (index) => {
    let newChoices = [...choices];
    newChoices.splice(index, 1);
    setChoices(newChoices);
  };

  return (
    <div align="center">
      <Grid
        container
        direction={"column"}
        align="left"
        columns={{ xs: 12, sm: 12, md: 12, lg: 12, xl: 12 }}
      >
        <Grid item>
          <Typography variant="p1"> Answers:</Typography>
        </Grid>
        {choices.map((choice, index) => {
          const readableIndex = index + 1;
          return (
            <div key={index}>
              <Grid
                container
                direction={"column"}
                columns={{ xs: 12, sm: 12, md: 12, lg: 12, xl: 12 }}
                align="left"
              >
                <Grid item sx={{ pt: 2 }}>
                  <Typography> Enter Choice {readableIndex}:</Typography>
                </Grid>
                <Grid container direction={"row"}>
                  <Grid item variant="outlined" sx={{ pt: 2 }}>
                    <FormControl variant="outlined">
                      <InputLabel>Choice {readableIndex}</InputLabel>
                      <OutlinedInput
                        type={"text"}
                        label={`Choice ${readableIndex}`}
                        defaultValue={dataChoices ? dataChoices[index] : ""}
                        value={choice.choice}
                        placeholder={`Enter Choice ${readableIndex}`}
                        onChange={(e) => handleChoiceChange(index, e)}
                        endAdornment={
                          <InputAdornment position="end">
                            <FormControlLabel
                              control={
                                <Checkbox
                                  checked={choices[index].isCorrect}
                                  onChange={(e) =>
                                    handleAnswerCorrectnessChange(index, e)
                                  }
                                  name="answer"
                                  edge="end"
                                />
                              }
                            />
                          </InputAdornment>
                        }
                      />
                    </FormControl>
                  </Grid>
                  <Grid item sx={{ pt: 2.75, pl: 1 }}>
                    {choices.length > 2 ? (
                      <IconButton
                        type="button"
                        onClick={() => removeAnswer(index)}
                      >
                        <CloseIcon />
                      </IconButton>
                    ) : null}
                  </Grid>
                </Grid>
              </Grid>
            </div>
          );
        })}

        <Grid item sx={{ pt: 2 }} align="left">
          <Fab color="primary" aria-label="add" onClick={addAnswer}>
            <AddIcon />
          </Fab>
        </Grid>
      </Grid>
    </div>
  );
}

export default MultipleChoice;
