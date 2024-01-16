import { useContext } from 'react';
import { useTranslation } from 'react-i18next';

import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import {
  Button,
  Grid,
  Skeleton,
  Step,
  StepButton,
  StepLabel,
  Stepper,
} from '@mui/material';

import { useLocalContext } from '@graasp/apps-query-client';
import { Context } from '@graasp/sdk';

import { MAX_QUESTION_LINES_TOP_BAR } from '../../config/constants';
import { hooks } from '../../config/queryClient';
import {
  QUESTION_BAR_CY,
  QUESTION_BAR_NEXT_CY,
  QUESTION_BAR_PREV_CY,
  QUESTION_STEP_CLASSNAME,
  buildQuestionStepCy,
} from '../../config/selectors';
import TypographyMaxLines from '../common/TypographyMaxLines';
import { QuizContext } from '../context/QuizContext';
import {
  computeCorrectness,
  getAppDataByQuestionIdForMemberId,
  getQuestionById,
} from '../context/utilities';
import { AppDataQuestion, QuestionAppDataData } from '../types/types';

const QuestionTopBar = () => {
  const { t } = useTranslation();
  const {
    questions,
    currentIdx,
    setCurrentIdx,
    moveToPreviousQuestion,
    order,
    moveToNextQuestion,
  } = useContext(QuizContext);
  const context = useLocalContext();
  const { data: appData, isLoading } = hooks.useAppData();
  const { memberId } = useLocalContext();

  if (isLoading) {
    return <Skeleton variant="rectangular" width="100%" height={70} />;
  }

  const renderLabel = (questionId: string, index: number) => {
    const question = getQuestionById(questions, questionId);
    if (!question) {
      console.error('question does not exist');
      return null;
    }
    const response = getAppDataByQuestionIdForMemberId(
      (appData as AppDataQuestion[]) ?? [],
      question,
      memberId
    );

    if (context.context === Context.Builder) {
      return (
        <StepButton onClick={() => setCurrentIdx(index)}>
          {question.data.question}
        </StepButton>
      );
    }

    // show correctness in label only if a response exists
    const isCorrect = computeCorrectness(
      question.data,
      response.data as QuestionAppDataData
    );

    const props = !response?.id
      ? {}
      : {
          StepIconComponent: isCorrect ? CheckIcon : CloseIcon,
          StepIconProps: {
            color: isCorrect ? 'success' : 'error',
          },
        };
    return (
      <StepLabel
        sx={{ '&:hover': { cursor: 'pointer' } }}
        onClick={() => setCurrentIdx(index)}
        {...props}
      >
        <TypographyMaxLines maxLines={MAX_QUESTION_LINES_TOP_BAR}>
          {question.data.question}
        </TypographyMaxLines>
      </StepLabel>
    );
  };

  return (
    <Grid
      container
      direction="row"
      alignItems="flex-start"
      justifyContent="center"
    >
      <Grid item>
        <Button
          data-cy={QUESTION_BAR_PREV_CY}
          sx={{ pr: 2 }}
          color="primary"
          onClick={moveToPreviousQuestion}
          disabled={currentIdx === 0}
        >
          {t('Prev')}
        </Button>
      </Grid>
      <Grid item>
        <Stepper
          data-cy={QUESTION_BAR_CY}
          nonLinear
          alternativeLabel
          activeStep={currentIdx}
        >
          {order?.map((qId: string, index: number) => (
            <Step
              key={qId}
              data-cy={buildQuestionStepCy(qId)}
              className={QUESTION_STEP_CLASSNAME}
            >
              {renderLabel(qId, index)}
            </Step>
          ))}
        </Stepper>
      </Grid>
      <Grid item>
        <Button
          data-cy={QUESTION_BAR_NEXT_CY}
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
};

export default QuestionTopBar;
