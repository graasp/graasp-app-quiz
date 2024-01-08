import { useContext, useEffect, useState } from 'react';

import { ExpandMore } from '@mui/icons-material';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Grid,
  Stack,
  Typography,
  useMediaQuery,
} from '@mui/material';

import { useLocalContext } from '@graasp/apps-query-client';

import { hooks } from '../../../config/queryClient';
import { QUESTION_BAR_CY } from '../../../config/selectors';
import theme from '../../../layout/theme';
import { QuizContext } from '../../context/QuizContext';
import {
  computeCorrectness,
  getAllAppDataByQuestionIdForMemberId,
  getQuestionById,
} from '../../context/utilities';
import { QuestionAppDataData } from '../../types/types';
import QuestionStep from './QuestionStep';
import QuestionTitleStepper from './QuestionTitleStepper';

const BG_COLOR = '#FCFCFC';
const BORDER_COLOR = '#CDCDCD';
const BORDER_RADIUS = '10px';
const BORDER_WIDTH = 1;

const QuestionStepDivider = () => (
  <div
    style={{
      width: '100%',
      height: `${BORDER_WIDTH / 2}px`,
      background: BORDER_COLOR,
    }}
  ></div>
);

export const QuestionStepper = () => {
  const enableAccordion = useMediaQuery(theme.breakpoints.down('md'));

  const { questions, currentIdx, currentQuestion, setCurrentIdx, order } =
    useContext(QuizContext);

  const { data: appData } = hooks.useAppData();
  const { memberId } = useLocalContext();

  const [currentNumberOfAttempts, setCurrentNumberOfAttempts] =
    useState<number>(0);
  const [isCorrect, setIsCorrect] = useState<boolean>(false);
  const [isExpanded, setIsExpanded] = useState<boolean>(!enableAccordion);

  const maxAttempts = currentQuestion.data.numberOfAttempts ?? 1;

  useEffect(() => {
    const responses = getAllAppDataByQuestionIdForMemberId(
      appData,
      currentQuestion.data.questionId,
      memberId
    );

    const response = responses[responses.length - 1];

    const isCorrect = computeCorrectness(
      currentQuestion.data,
      response?.data as QuestionAppDataData
    );

    setIsCorrect(isCorrect);
    setCurrentNumberOfAttempts(responses.length);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentQuestion, appData]);

  const renderQuestionStep = (questionId: string, index: number) => {
    const question = getQuestionById(questions, questionId);
    if (!question) {
      console.error('question does not exist');
      return null;
    }

    const responses = getAllAppDataByQuestionIdForMemberId(
      appData,
      questionId,
      memberId
    );

    const response = responses[responses.length - 1];
    const numberOfAttempts = question.data.numberOfAttempts ?? 1;

    // show correctness in label only if a response exists
    const isCorrect = computeCorrectness(
      question.data,
      response?.data as QuestionAppDataData
    );

    return (
      <QuestionStep
        qId={questionId}
        isCorrect={isCorrect}
        numberOfAttempts={numberOfAttempts}
        currentNumberOfAttempts={responses.length}
        questionIdx={index + 1}
        isSelected={questionId === currentQuestion.data.questionId}
        onClick={(qIdx) => setCurrentIdx(qIdx)}
      />
    );
  };

  const handleAccordionChange = () => {
    if (enableAccordion) {
      setIsExpanded(!isExpanded);
    } else {
      setIsExpanded(true);
    }
  };

  return (
    <Box
      mb={4}
      sx={{
        width: '100%',
      }}
    >
      <Accordion
        expanded={isExpanded || !enableAccordion}
        onChange={handleAccordionChange}
        sx={{
          bgcolor: BG_COLOR,
          border: `${BORDER_WIDTH}px solid ${BORDER_COLOR}`,
          borderRadius: BORDER_RADIUS,
          boxShadow: 'none',
          width: '100%',
        }}
      >
        <AccordionSummary
          expandIcon={enableAccordion ? <ExpandMore /> : null}
          style={{ cursor: enableAccordion ? 'cursor' : 'default' }}
        >
          <QuestionTitleStepper
            isCorrect={isCorrect}
            currentNumberOfAttempts={currentNumberOfAttempts}
            numberOfAttempts={maxAttempts}
            questionIndex={currentIdx + 1}
          />
        </AccordionSummary>
        <QuestionStepDivider />
        <AccordionDetails>
          <Stack mt={1}>
            <Typography variant="h6">Quiz Navigation</Typography>
            <Grid
              container
              alignItems="center"
              justifyContent="start"
              rowSpacing={1}
              data-cy={QUESTION_BAR_CY}
            >
              {order.map((questionId, idx) => (
                <Grid item xs={1.4} sm={1.4} md={2.4} key={idx}>
                  {renderQuestionStep(questionId, idx)}
                </Grid>
              ))}
            </Grid>
          </Stack>
        </AccordionDetails>
      </Accordion>
    </Box>
  );
};

export default QuestionStepper;
