import { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Alert, Button, Grid, Typography } from '@mui/material';

import { Data, useLocalContext } from '@graasp/apps-query-client';
import { AppData } from '@graasp/sdk';

import { APP_DATA_TYPES, QuestionType } from '../../config/constants';
import { hooks, mutations } from '../../config/queryClient';
import {
  PLAY_VIEW_EMPTY_QUIZ_CY,
  PLAY_VIEW_QUESTION_TITLE_CY,
  PLAY_VIEW_SUBMIT_BUTTON_CY,
} from '../../config/selectors';
import { QUIZ_TRANSLATIONS } from '../../langs/constants';
import { setInData } from '../../utils/immutable';
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
  QuestionAppDataData,
  QuestionData,
  SliderAppDataData,
  TextAppDataData,
} from '../types/types';
import PlayExplanation from './PlayExplanation';
import PlayFillInTheBlanks from './PlayFillInTheBlanks';
import PlayHints from './PlayHints';
import PlayMultipleChoices from './PlayMultipleChoices';
import PlaySlider from './PlaySlider';
import PlayTextInput from './PlayTextInput';

const PlayView = () => {
  const { t } = useTranslation();
  const { data: responses, isSuccess } = hooks.useAppData();
  const { mutate: postAppData } = mutations.usePostAppData();
  const { currentQuestion, questions, currentIdx } = useContext(QuizContext);
  const { memberId } = useLocalContext();

  const [newResponse, setNewResponse] = useState<Data>(
    getAppDataByQuestionIdForMemberId(responses, currentQuestion, memberId).data
  );
  const [userAnswers, setUserAnswers] = useState<AppData[]>([]);
  const [showCorrectness, setShowCorrectness] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean>(false);

  const numberOfAnswers = userAnswers.length;
  const latestAnswer = userAnswers.at(numberOfAnswers - 1);
  const maxAttempts = currentQuestion.data.numberOfAttempts ?? 1;
  const maxAttemptsReached = numberOfAnswers >= maxAttempts;
  const isReadonly = isCorrect || maxAttemptsReached;
  const showCorrection = isCorrect || numberOfAnswers >= maxAttempts;

  // This use effect is used to reset the show correction when question changed.
  // It ensures that the answers are not leaked when changing to next question.
  // See https://github.com/graasp/graasp-app-quiz/issues/111 for more information.
  useEffect(() => {
    setUserAnswers([]);
    setShowCorrectness(false);
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

  const onInputChanged = <T extends Data, K extends keyof T, V extends T[K]>(
    object: Partial<T>,
    key: K,
    value: V,
    prevValue: V | undefined,
  ) => {
    // reset correctness on value changed if not the same
    // this allow to show prev error and avoid to show success
    // if the user write or move (slider) to the correct response before submit.
    setShowCorrectness(value === prevValue);
    setNewResponse(setInData(object, key, value));
  };

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
        <AttemptsProgress
          value={numberOfAnswers}
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
                  response={newResponse as MultipleChoiceAppDataData}
                  setResponse={(choices) => {
                    setNewResponse(
                      setInData(newResponse, 'choices', choices)
                    );
                    setShowCorrectness(false);
                  }}
                  showCorrection={showCorrection}
                  showCorrectness={showCorrectness}
                  isReadonly={isReadonly}
                />
              );
            }
            case QuestionType.TEXT_INPUT: {
              return (
                <PlayTextInput
                  values={currentQuestion.data}
                  response={newResponse as TextAppDataData}
                  setResponse={(text: string) => {
                    onInputChanged(
                      newResponse,
                      'text',
                      text,
                      latestAnswer?.data?.text
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
                  response={newResponse as FillTheBlanksAppDataData}
                  setResponse={(text: string) => {
                    setNewResponse(
                      setInData(newResponse, 'text', text)
                    );
                    setShowCorrectness(false);
                  }}
                  showCorrection={showCorrection}
                  showCorrectness={showCorrectness}
                  isReadonly={isReadonly}
                />
              );
            }
            case QuestionType.SLIDER: {
              return (
                <PlaySlider
                  values={currentQuestion.data}
                  response={newResponse as SliderAppDataData}
                  setResponse={(value: number) => {
                    onInputChanged(
                      newResponse,
                      'value',
                      value,
                      latestAnswer?.data?.value
                    );
                  }}
                  showCorrection={showCorrection}
                  showCorrectness={showCorrectness}
                  isReadonly={isReadonly}
                  isCorrect={isCorrect}
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

      <PlayHints
        hints={currentQuestion.data.hints}
        isCorrect={isCorrect}
        currentAttempts={userAnswers.length}
        maxAttempts={maxAttempts}
      />

      <PlayExplanation
        showCorrection={showCorrection}
        showCorrectness={showCorrectness}
        currentQuestionData={currentQuestion.data as QuestionData}
        response={newResponse as MultipleChoiceAppDataData}
      />
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
