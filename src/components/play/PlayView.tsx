import React, { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Alert, Button, Grid, Typography } from '@mui/material';

import { useLocalContext } from '@graasp/apps-query-client';
import { AppData } from '@graasp/sdk';

import { APP_DATA_TYPES, QuestionType } from '../../config/constants';
import { hooks, mutations } from '../../config/queryClient';
import {
  PLAY_VIEW_EMPTY_QUIZ_CY,
  PLAY_VIEW_QUESTION_TITLE_CY,
  PLAY_VIEW_SUBMIT_BUTTON_CY,
} from '../../config/selectors';
import { QUIZ_TRANSLATIONS } from '../../langs/constants';
import { setIn, setInData } from '../../utils/immutable';
import AttemptsProgress from '../common/AttemptsProgress';
import { QuizContext } from '../context/QuizContext';
import {
  computeCorrectness,
  getAllAppDataByQuestionIdForMemberId,
  getAppDataByQuestionIdForMemberId,
} from '../context/utilities';
import QuestionTopBar from '../navigation/QuestionTopBar';
import {
  FillTheBlanksAppDataData,
  MultipleChoiceAppDataData,
  QuestionData,
  SliderAppDataData,
  TextAppDataData,
} from '../types/types';
import PlayExplanation from './PlayExplanation';
import PlayFillInTheBlanks from './PlayFillInTheBlanks';
import PlayMultipleChoices from './PlayMultipleChoices';
import PlaySlider from './PlaySlider';
import PlayTextInput from './PlayTextInput';

const PlayView = () => {
  const { t } = useTranslation();
  const { data: responses, isSuccess } = hooks.useAppData();
  const { mutate: postAppData } = mutations.usePostAppData();

  const { currentQuestion, questions } = useContext(QuizContext);
  const { memberId } = useLocalContext();

  const [newResponse, setNewResponse] = useState<Partial<AppData> | undefined>(
    getAppDataByQuestionIdForMemberId(responses, currentQuestion, memberId)
  );
  // TODO: find a way to update userAnswers when responses are updated without using state
  const [userAnswers, setUserAnswers] = useState<AppData[]>([]);
  const [showCorrection, setShowCorrection] = React.useState(false);
  const [showCorrectness, setShowCorrectness] = React.useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean>(false);
  const [isReadonly, setIsReadonly] = useState<boolean>(false);

  const getLatestUserAnswers = () =>
    userAnswers.length > 0 ? userAnswers.at(userAnswers.length - 1) : undefined;
  const maxAttempts = currentQuestion.data.numberOfAttempts
    ? currentQuestion.data.numberOfAttempts
    : 1;
  const maxAttemptsReached = userAnswers.length >= maxAttempts;

  useEffect(() => {
    if (responses) {
      setNewResponse(
        getAppDataByQuestionIdForMemberId(responses, currentQuestion, memberId)
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess, currentQuestion]);

  useEffect(() => {
    const isCorrect = computeCorrectness(
      currentQuestion.data,
      newResponse?.data as TextAppDataData
    );
    setIsCorrect(isCorrect);
    setIsReadonly(isCorrect || maxAttemptsReached);

    setShowCorrection(isCorrect || (userAnswers?.length || 0) >= maxAttempts);
    setShowCorrectness(userAnswers.length > 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [maxAttempts, userAnswers]);

  // TODO: try to avoid this useEffect
  useEffect(() => {
    setUserAnswers(
      getAllAppDataByQuestionIdForMemberId(
        responses,
        currentQuestion.data.questionId,
        memberId
      )
    );
  }, [currentQuestion, memberId, responses]);

  const onInputChanged = <
    T extends AppData,
    K extends keyof T['data'],
    V extends T['data'][K]
  >(
    object: Partial<T>,
    key: K,
    value: V,
    prevValue: V | undefined
  ) => {
    setShowCorrectness(value === prevValue);
    setNewResponse(setInData(object, key, value));
  };

  const onSubmit = () => {
    if (isReadonly) {
      return;
    }

    if (newResponse && newResponse.data) {
      postAppData({
        data: newResponse.data,
        type: APP_DATA_TYPES.RESPONSE,
      });
    } else {
      console.error('The response is not defined !');
    }
  };

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
    <Grid container direction="column" alignItems="center" spacing={2}>
      <Grid item>
        <QuestionTopBar />
      </Grid>
      <Grid item>
        <Typography
          variant="h4"
          sx={{ pb: 2 }}
          data-cy={PLAY_VIEW_QUESTION_TITLE_CY}
        >
          {currentQuestion.data.question}
        </Typography>
        <AttemptsProgress
          value={userAnswers.length}
          maxValue={currentQuestion.data.numberOfAttempts ?? 1}
          sx={{
            mb: 3,
          }}
          color={isCorrect ? 'success' : 'error'}
        />
      </Grid>
      <Grid container>
        {(() => {
          if (!newResponse) {
            return (
              <Typography>
                {t(QUIZ_TRANSLATIONS.NO_RESPONSE_FOR_NOW)}
              </Typography>
            );
          }

          switch (currentQuestion.data.type) {
            case QuestionType.MULTIPLE_CHOICES: {
              return (
                <PlayMultipleChoices
                  choices={currentQuestion.data.choices}
                  response={newResponse.data as MultipleChoiceAppDataData}
                  setResponse={(choices) => {
                    setNewResponse(setInData(newResponse, 'choices', choices));
                  }}
                  showCorrection={showCorrection}
                  showCorrectness={showCorrectness}
                />
              );
            }
            case QuestionType.TEXT_INPUT: {
              return (
                <PlayTextInput
                  values={currentQuestion.data}
                  response={newResponse.data as TextAppDataData}
                  setResponse={(text: string) => {
                    onInputChanged(
                      newResponse,
                      'text',
                      text,
                      getLatestUserAnswers()?.data?.text
                    );
                  }}
                  showCorrection={showCorrection}
                  showCorrectness={showCorrectness}
                  isCorrect={isCorrect}
                  isReadonly={isReadonly}
                />
              );
            }
            case QuestionType.FILL_BLANKS: {
              return (
                <PlayFillInTheBlanks
                  values={currentQuestion.data}
                  response={newResponse.data as FillTheBlanksAppDataData}
                  setResponse={(text: string) => {
                    setNewResponse(setInData(newResponse, 'text', text));
                  }}
                  showCorrection={showCorrection}
                />
              );
            }
            case QuestionType.SLIDER: {
              return (
                <PlaySlider
                  values={currentQuestion.data}
                  response={newResponse.data as SliderAppDataData}
                  setResponse={(value: number) => {
                    setNewResponse(
                      setIn(newResponse, 'data', {
                        value: value,
                      })
                    );
                  }}
                  showCorrection={showCorrection}
                />
              );
            }
            default:
              return (
                <Alert severity="error">{t('Unknown question type')}</Alert>
              );
          }
        })()}
      </Grid>
      {showCorrection && (
        <PlayExplanation
          currentQuestionData={currentQuestion.data as QuestionData}
        />
      )}
      <Grid item xs={12}>
        <Button
          onClick={onSubmit}
          variant="contained"
          data-cy={PLAY_VIEW_SUBMIT_BUTTON_CY}
          disabled={isReadonly}
        >
          {t('Submit')}
        </Button>
      </Grid>
    </Grid>
  );
};

export default PlayView;
