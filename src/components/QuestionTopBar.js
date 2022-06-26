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

const steps = ["Question 1", "Question 2", "Question 3"];

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
  currentQuestionIndex,
  setCurrentQuestionIndex,
  questionList,
  setQuestionList,
  onAddQuestion
}) {
  const { data, isSuccess } = useAppData();
  const { mutate: postAppData } = useMutation(MUTATION_KEYS.POST_APP_DATA);

  const [completed, setCompleted] = React.useState({});

  const totalSteps = () => {
    return questionList ? questionList.length : 0;
  };

  const completedSteps = () => {
    return Object.keys(completed).length;
  };

  const isLastStep = () => {
    return currentQuestionIndex === totalSteps() - 1;
  };

  const allStepsCompleted = () => {
    return completedSteps() === totalSteps();
  };

  const handleNext = () => {
    const newActiveStep =
      isLastStep() && !allStepsCompleted()
        ? // It's the last step, but not all steps have been completed,
          // find the first step that has been completed
          questionList
          ? questionList.findIndex((step, i) => !(i in completed))
          : currentQuestionIndex + 1
        : currentQuestionIndex + 1;
    setCurrentQuestionIndex(newActiveStep);
  };

  const handleBack = () => {
    setCurrentQuestionIndex((prevActiveStep) => prevActiveStep - 1);
  };

  const handleStep = (step) => () => {
    setCurrentQuestionIndex(step);
  };

  const handleComplete = () => {
    const newCompleted = completed;
    newCompleted[currentQuestionIndex] = true;
    setCompleted(newCompleted);
    handleNext();
  };

  const handleReset = () => {
    setCurrentQuestionIndex(0);
    setCompleted({});
  };

  return (
    <div>
      <Grid container direction={"row"}>
        <Grid item>
          <Stepper nonLinear alternativeLabel activeStep={currentQuestionIndex}>
            {questionList?.map((label, index) => (
              <Step key={label} completed={completed[index]}>
                <StepButton color="inherit" onClick={handleStep(index)}>
                  {`Question ${index + 1}`}
                </StepButton>
              </Step>
            ))}
            <Step key="plus">
              <StepLabel
              icon={<ThemeProvider theme={buttonTheme}>
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
            </ThemeProvider>}
              >
             </StepLabel>
           </Step>
          </Stepper>
        </Grid>
      </Grid>

      <Grid container direction={"row"} alignItems="left">
        {allStepsCompleted() ? (
          <Grid item>
            <Typography sx={{ mt: 2, mb: 1 }}>
              All steps completed - you&apos;re finished
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
              <Box sx={{ flex: "1 1 auto" }} />
              <Button onClick={handleReset}>Reset</Button>
            </Box>
          </Grid>
        ) : null}
      </Grid>
    </div>
  );
}
