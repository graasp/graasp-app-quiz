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
import { QuizContext } from '../context/QuizContext';
import { getAppDataByQuestionIdForMemberId } from '../context/utilities';
import QuestionTopBar from '../navigation/QuestionTopBar';
import {
  AppDataQuestion,
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
  const { mutate: patchAppData } = mutations.usePatchAppData();

  const { currentQuestion, questions } = useContext(QuizContext);
  const { memberId } = useLocalContext();

  const [showCorrection, setShowCorrection] = React.useState(false);

  const [newResponse, setNewResponse] = useState<Partial<AppData> | undefined>(
    getAppDataByQuestionIdForMemberId(
      responses as AppDataQuestion[],
      currentQuestion,
      memberId
    )
  );

  useEffect(() => {
    if (responses) {
      // assume there's only one response for a question
      setNewResponse(
        getAppDataByQuestionIdForMemberId(
          responses as AppDataQuestion[],
          currentQuestion,
          memberId
        )
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess, currentQuestion]);

  useEffect(() => {
    setShowCorrection(Boolean(newResponse?.id));
  }, [newResponse]);

  const onSubmit = () => {
    if (newResponse) {
      setShowCorrection(true);
      if (newResponse.id) {
        patchAppData({
          id: newResponse.id,
          data: newResponse.data,
        });
      } else {
        postAppData({
          data: newResponse.data as AppData, // TODO: check this to ensure it is complete AppData
          type: APP_DATA_TYPES.RESPONSE,
        });
      }
    } else {
      // TODO: check what to do if no new response ?
      console.error('The response is not defined !');
    }
  };

  const setInData = <
    T extends AppData,
    K extends keyof T['data'],
    V extends T['data'][K]
  >(
    object: Partial<T>,
    key: K,
    value: V
  ): Partial<T> => {
    return {
      ...object,
      data: {
        ...object.data,
        [key]: value,
      },
    };
  };

  const setIn = <T extends AppData, K extends keyof T, V extends T[K]>(
    object: Partial<T>,
    key: K,
    value: V
  ): Partial<T> => {
    return {
      ...object,
      [key]: value,
    };
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
      </Grid>
      <Grid container>
        {(() => {
          // TODO: check this 
          if (!newResponse) {
            return null;
          }

          switch (currentQuestion.data.type) {
            case QuestionType.MULTIPLE_CHOICES: {
              return (
                <PlayMultipleChoices
                  choices={currentQuestion.data.choices}
                  response={newResponse.data as MultipleChoiceAppDataData} // TODO: check if cast is needed
                  setResponse={(choices) => {
                    setNewResponse(setInData(newResponse, 'choices', choices));
                  }}
                  showCorrection={showCorrection}
                />
              );
            }
            case QuestionType.TEXT_INPUT: {
              return (
                <PlayTextInput
                  values={currentQuestion.data}
                  response={newResponse.data as TextAppDataData} // TODO: check cast
                  setResponse={(text: string) => {
                    setNewResponse(setInData(newResponse, 'text', text));
                  }}
                  showCorrection={showCorrection}
                />
              );
            }
            case QuestionType.FILL_BLANKS: {
              return (
                <PlayFillInTheBlanks
                  values={currentQuestion.data}
                  response={newResponse.data as FillTheBlanksAppDataData} // TODO: check cast
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
                  response={newResponse.data as SliderAppDataData} // TODO: check cast
                  setResponse={(value: number) => {
                    setNewResponse(
                      // TODO: check this
                      // newResponse.update('data', (data) =>
                      //   data.merge({ value })
                      // )
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
          currentQuestionData={currentQuestion.data as QuestionData} // TODO: check if cast is needed
        />
      )}
      <Grid item xs={12}>
        <Button
          onClick={onSubmit}
          variant="contained"
          data-cy={PLAY_VIEW_SUBMIT_BUTTON_CY}
        >
          {t('Submit')}
        </Button>
      </Grid>
    </Grid>
  );
};

export default PlayView;
