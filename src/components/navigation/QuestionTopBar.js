import React, { useContext } from 'react';

import { Step, Stepper } from '@mui/material';
import StepButton from '@mui/material/StepButton';

import { QuizContext } from '../context/QuizContext';

export default function QuestionTopBar({ additionalSteps }) {
  const { questions, currentIdx, setCurrentIdx } = useContext(QuizContext);

  return (
    <Stepper nonLinear alternativeLabel activeStep={currentIdx}>
      {questions?.map((label, index) => (
        <Step key={label} completed={questions ? questions[index] : false}>
          <StepButton color="inherit" onClick={() => setCurrentIdx(index)}>
            {`Question ${index + 1}`}
          </StepButton>
        </Step>
      ))}
      {additionalSteps}
    </Stepper>
  );
}
