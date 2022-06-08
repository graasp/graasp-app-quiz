import * as React from "react";
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepButton from "@mui/material/StepButton";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { useAppData } from "./context/hooks";
import { MUTATION_KEYS, useMutation } from "../config/queryClient";

const steps = ["Question 1", "Question 2", "Question 3"];

export default function QuestionTopBar({
  currentQuestion,
  setCurrentQuestion,
}) {
  const { data, isSuccess } = useAppData();
  const { mutate: postAppData } = useMutation(MUTATION_KEYS.POST_APP_DATA);

  const [completed, setCompleted] = React.useState({});

  const totalSteps = () => {
    return steps.length;
  };

  const completedSteps = () => {
    return Object.keys(completed).length;
  };

  const isLastStep = () => {
    return currentQuestion === totalSteps() - 1;
  };

  const allStepsCompleted = () => {
    return completedSteps() === totalSteps();
  };

  const handleNext = () => {
    const newActiveStep =
      isLastStep() && !allStepsCompleted()
        ? // It's the last step, but not all steps have been completed,
          // find the first step that has been completed
          steps.findIndex((step, i) => !(i in completed))
        : currentQuestion + 1;
    setCurrentQuestion(newActiveStep);
  };

  const handleBack = () => {
    setCurrentQuestion((prevActiveStep) => prevActiveStep - 1);
  };

  const handleStep = (step) => () => {
    setCurrentQuestion(step);
  };

  const handleComplete = () => {
    const newCompleted = completed;
    newCompleted[currentQuestion] = true;
    setCompleted(newCompleted);
    handleNext();
  };

  const handleReset = () => {
    setCurrentQuestion(0);
    setCompleted({});
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Stepper nonLinear alternativeLabel activeStep={currentQuestion}>
        {steps.map((label, index) => (
          <Step key={label} completed={completed[index]}>
            <StepButton color="inherit" onClick={handleStep(index)}>
              {label}
            </StepButton>
          </Step>
        ))}
      </Stepper>
      <div>
        {allStepsCompleted() ? (
          <React.Fragment>
            <Typography sx={{ mt: 2, mb: 1 }}>
              All steps completed - you&apos;re finished
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
              <Box sx={{ flex: "1 1 auto" }} />
              <Button onClick={handleReset}>Reset</Button>
            </Box>
          </React.Fragment>
        ) : (
          <React.Fragment>
            <Typography sx={{ mt: 2, mb: 1 }}>
              Question {currentQuestion + 1}
            </Typography>
            {/* <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
              <Button
                color="inherit"
                disabled={currentQuestion === 0}
                onClick={handleBack}
                sx={{ mr: 1 }}
              >
                Back
              </Button>
              <Box sx={{ flex: '1 1 auto' }} />
              <Button onClick={handleNext} sx={{ mr: 1 }}>
                Next
              </Button>
              {currentQuestion !== steps.length &&
                (completed[currentQuestion] ? (
                  <Typography variant="caption" sx={{ display: 'inline-block' }}>
                    Step {currentQuestion + 1} already completed
                  </Typography>
                ) : (
                  <Button onClick={handleComplete}>
                    {completedSteps() === totalSteps() - 1
                      ? 'Finish'
                      : 'Complete Step'}
                  </Button>
                ))}
            </Box> */}
          </React.Fragment>
        )}
      </div>
    </Box>
  );
}
