import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';

import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import { Button, Grid, Step, StepLabel, Stepper } from '@mui/material';

import { hooks } from '../../config/queryClient';
import { QuizContext } from '../context/QuizContext';
import {
  computeCorrectness,
  getAppDataByQuestionId,
  getDataWithId,
} from '../context/utilities';

export default function QuestionTopBar({ additionalSteps }) {
  const { t } = useTranslation();
  const {
    questions,
    currentIdx,
    setCurrentIdx,
    moveToPreviousQuestion,
    order,
    moveToNextQuestion,
  } = useContext(QuizContext);
  const { data: appData, isLoading } = hooks.useAppData();

  if (isLoading) {
    return 'is loading app data';
  }

  const renderLabel = (questionId, index) => {
    const response = getAppDataByQuestionId(appData, questionId);
    const question = getDataWithId(questions, questionId);
    const isCorrect = computeCorrectness(response.data, question.data);

    // show correctness in label only if a response exists
    const props = !response.id
      ? {}
      : {
          StepIconComponent: isCorrect ? CheckIcon : CloseIcon,
          StepIconProps: { color: isCorrect ? 'success' : 'error' },
        };

    return (
      <StepLabel
        sx={{ '&:hover': { cursor: 'pointer' } }}
        onClick={() => setCurrentIdx(index)}
        {...props}
      >
        {question.data.question}
      </StepLabel>
    );
  };

  return (
    <Grid
      container
      direction={'row'}
      alignItems="flex-start"
      justifyContent="center"
    >
      <Grid item>
        <Button
          sx={{ p: 0 }}
          color="primary"
          onClick={moveToPreviousQuestion}
          disabled={currentIdx === 0}
        >
          {t('Prev')}
        </Button>
      </Grid>
      <Grid item>
        <Stepper
          nonLinear
          alternativeLabel
          activeStep={currentIdx}
          sx={{ pb: 3 }}
        >
          {order?.map((qId, index) => (
            <Step key={qId}>{renderLabel(qId, index)}</Step>
          ))}
          {additionalSteps}
        </Stepper>
      </Grid>
      <Grid item>
        <Button
          sx={{ p: 0 }}
          color="primary"
          onClick={moveToNextQuestion}
          disabled={currentIdx >= order.length - 1}
        >
          {t('Next')}
        </Button>
      </Grid>
    </Grid>
  );
}
