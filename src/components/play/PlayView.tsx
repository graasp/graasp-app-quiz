import { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Alert, Box, Button, Stack, Typography } from '@mui/material';

import { Data, useLocalContext } from '@graasp/apps-query-client';
import { AppData } from '@graasp/sdk';

import { APP_DATA_TYPES, QuestionType } from '../../config/constants';
import { hooks, mutations } from '../../config/queryClient';
import {
  PLAY_VIEW_EMPTY_QUIZ_CY,
  PLAY_VIEW_QUESTION_TITLE_CY,
  PLAY_VIEW_RETRY_BUTTON_CY,
  PLAY_VIEW_SUBMIT_BUTTON_CY,
  QUESTION_BAR_NEXT_CY,
  QUESTION_BAR_PREV_CY,
} from '../../config/selectors';
import { QUIZ_TRANSLATIONS } from '../../langs/constants';
import { QuizContext } from '../context/QuizContext';
import {
  computeCorrectness,
  getAllAppDataByQuestionIdForMemberId,
  getAppDataByQuestionIdForMemberId,
} from '../context/utilities';
import QuestionStepper from '../navigation/questionNavigation/QuestionStepper';
import { QuestionAppDataData, QuestionData } from '../types/types';
import PlayExplanation from './PlayExplanation';
import PlayHints from './PlayHints';
import PlayViewQuestionType from './PlayViewQuestionType';

const PlayView = () => {
  const { t } = useTranslation();
  const { data: responses, isSuccess } = hooks.useAppData();
  const { mutate: postAppData } = mutations.usePostAppData();
  const {
    currentQuestion,
    questions,
    currentIdx,
    moveToNextQuestion,
    moveToPreviousQuestion,
  } = useContext(QuizContext);
  const { memberId } = useLocalContext();

  const [newResponse, setNewResponse] = useState<Data>(
    getAppDataByQuestionIdForMemberId(responses, currentQuestion, memberId).data
  );
  const [userAnswers, setUserAnswers] = useState<AppData[]>([]);
  const [showCorrectness, setShowCorrectness] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean>(false);
  // this state is used to determine if the animations should to be activated or not.
  const [numberOfSubmit, setNumberOfSubmit] = useState(0);

  const numberOfAnswers = userAnswers.length;
  const latestAnswer = userAnswers.at(numberOfAnswers - 1);
  const maxAttempts = currentQuestion.data.numberOfAttempts ?? 1;
  const maxAttemptsReached = numberOfAnswers >= maxAttempts;
  const isReadonly = isCorrect || maxAttemptsReached;
  const showCorrection = isCorrect || numberOfAnswers >= maxAttempts;
  const displaySubmitBtn = !(
    currentQuestion.data.type === QuestionType.MULTIPLE_CHOICES &&
    showCorrectness &&
    !showCorrection
  );

  // This use effect is used to reset the show correction when question changed.
  // It ensures that the answers are not leaked when changing to next question.
  // See https://github.com/graasp/graasp-app-quiz/issues/111 for more information.
  useEffect(() => {
    setUserAnswers([]);
    setShowCorrectness(false);
    setNumberOfSubmit(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIdx]);

  useEffect(() => {
    if (responses) {
      setNewResponse(
        getAppDataByQuestionIdForMemberId(responses, currentQuestion, memberId)
          .data
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess, currentQuestion]);

  useEffect(() => {
    const isCorrect = computeCorrectness(
      currentQuestion.data,
      newResponse as QuestionAppDataData
    );

    setIsCorrect(isCorrect);
    setShowCorrectness(numberOfAnswers > 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [maxAttempts, userAnswers]);

  useEffect(() => {
    setUserAnswers(
      getAllAppDataByQuestionIdForMemberId(
        responses,
        currentQuestion.data.questionId,
        memberId
      )
    );
  }, [currentQuestion, memberId, responses]);

  const onSubmit = () => {
    if (isReadonly) {
      return;
    }

    if (newResponse) {
      postAppData({
        data: newResponse,
        type: APP_DATA_TYPES.RESPONSE,
      });
    } else {
      console.error('The response is not defined !');
    }
  };

  const renderNavigationButtons = () => (
    <Stack direction="row" justifyContent="space-between" width="100%">
      <Button
        onClick={moveToPreviousQuestion}
        variant="outlined"
        data-cy={QUESTION_BAR_PREV_CY}
        disabled={currentIdx === 0}
      >
        {t(QUIZ_TRANSLATIONS.PREV_QUESTION_BTN)}
      </Button>

      <Button
        onClick={moveToNextQuestion}
        variant="outlined"
        data-cy={QUESTION_BAR_NEXT_CY}
        disabled={currentIdx === questions.length - 1}
      >
        {t(QUIZ_TRANSLATIONS.NEXT_QUESTION_BTN)}
      </Button>
    </Stack>
  );

  if (!questions || questions.length === 0) {
    return (
      <Alert severity="info" data-cy={PLAY_VIEW_EMPTY_QUIZ_CY}>
        {t('The quiz has not been defined')}
      </Alert>
    );
  }

  if (!currentQuestion) {
    return <Typography>no current question</Typography>;
  }

  return (
    <Stack
      direction={{ xs: 'column', md: 'row-reverse' }}
      justifyContent="space-between"
      alignContent="center"
    >
      <Box width={{ xs: '100%', md: '20%' }}>
        <QuestionStepper />
      </Box>

      <Stack
        direction="column"
        alignItems="center"
        justifyContent="center"
        spacing={2}
        width={{ xs: '100%', md: '60%' }}
        ml={{ sm: 0 }}
      >
        {/* TODO: check if the box is needed needed */}
        <Box mb={4} width="100%">
          {renderNavigationButtons()}
        </Box>
        <Typography
          component="h1"
          variant="h5"
          sx={{
            pb: 2,
          }}
          data-cy={PLAY_VIEW_QUESTION_TITLE_CY}
          textAlign="center"
        >
          {currentQuestion.data.question}
        </Typography>
        <PlayViewQuestionType
          newResponse={newResponse}
          currentQuestion={currentQuestion}
          showCorrection={showCorrection}
          showCorrectness={showCorrectness}
          isReadonly={isReadonly}
          isCorrect={isCorrect}
          latestAnswer={latestAnswer}
          setShowCorrectness={setShowCorrectness}
          setNewResponse={setNewResponse}
          numberOfSubmit={numberOfSubmit}
          currentNumberOfAttempts={numberOfAnswers}
          maxNumberOfAttempts={maxAttempts}
          resetNumberOfSubmit={() => setNumberOfSubmit(0)}
        />
        <PlayHints
          hints={currentQuestion.data.hints}
          isCorrect={isCorrect}
          currentAttempts={userAnswers.length}
          maxAttempts={maxAttempts}
        />
        <PlayExplanation
          showCorrection={showCorrection}
          currentQuestionData={currentQuestion.data as QuestionData}
        />
        <Box mt={4}>
          {displaySubmitBtn && (
            <Button
              onClick={() => {
                setNumberOfSubmit(numberOfSubmit + 1);
                onSubmit();
              }}
              variant="contained"
              data-cy={PLAY_VIEW_SUBMIT_BUTTON_CY}
              disabled={isReadonly}
            >
              {t('Submit')}
            </Button>
          )}

          {!displaySubmitBtn && (
            <Button
              onClick={() => {
                setNumberOfSubmit(numberOfSubmit + 1);
                setShowCorrectness(false);
              }}
              variant="contained"
              data-cy={PLAY_VIEW_RETRY_BUTTON_CY}
            >
              {t(QUIZ_TRANSLATIONS.PLAY_VIEW_RETRY_BTN)}
            </Button>
          )}
        </Box>
      </Stack>
    </Stack>
  );
};

export default PlayView;
