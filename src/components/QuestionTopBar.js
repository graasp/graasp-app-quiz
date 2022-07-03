import * as React from "react";
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
import StepButton from "@mui/material/StepButton";
import { useAppData } from "./context/hooks";
import { MUTATION_KEYS, useMutation } from "../config/queryClient";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { CREATE, PLAY } from "./constants";

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

const buttonTheme = createTheme({
  palette: {
    secondary: {
      main: "#000000",
    },
  },
});

export default function QuestionTopBar({
  screenType,
  currentQuestionIndex,
  setCurrentQuestionIndex,
  questionList,
  onAddQuestion,
  completedQuestions,
  viewedQuestions,
}) {

  const handleStep = (step) => () => {
    if (screenType === CREATE || (screenType === PLAY && viewedQuestions[step])) {
      setCurrentQuestionIndex(step);
    }
  };

  return (
    <div>
      <Grid container direction={"row"}>
        <Grid item>
          <Stepper nonLinear alternativeLabel activeStep={currentQuestionIndex}>
            {questionList?.map((label, index) => (
              <Step key={label} completed={completedQuestions[index]}>
                <StepButton color="inherit" onClick={handleStep(index)}>
                  {`Question ${index + 1}`}
                </StepButton>
              </Step>
            ))}
            {screenType === CREATE ? (
              <Step key="plus">
                <StepLabel
                  icon={
                    <ThemeProvider theme={buttonTheme}>
                      <Fab
                        color="primary"
                        aria-label="add"
                        justify-content="center"
                        style={buttonStyle}
                        onClick={onAddQuestion}
                        align="center"
                      >
                        <AddIcon style={addStyle} />
                      </Fab>
                    </ThemeProvider>
                  }
                ></StepLabel>
              </Step>
            ) : null}
          </Stepper>
        </Grid>
      </Grid>
    </div>
  );
}
