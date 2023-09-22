import { List } from 'immutable';

import React, { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Alert, Button, Grid, Typography } from '@mui/material';

import { useLocalContext } from '@graasp/apps-query-client';
import { AppDataRecord } from '@graasp/sdk/frontend';

import { APP_DATA_TYPES, QuestionType } from '../../config/constants';
import { hooks, mutations } from '../../config/queryClient';
import {
  EXPLANATION_PLAY_CY,
  PLAY_VIEW_EMPTY_QUIZ_CY,
  PLAY_VIEW_QUESTION_TITLE_CY,
  PLAY_VIEW_SUBMIT_BUTTON_CY,
} from '../../config/selectors';
import { QuizContext } from '../context/QuizContext';
import { getAppDataByQuestionIdForMemberId } from '../context/utilities';
import QuestionTopBar from '../navigation/QuestionTopBar';
import {
  AppDataQuestionRecord,
  MultipleChoiceAppDataDataRecord,
  SliderAppDataDataRecord,
} from '../types/types';
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

  const [newResponse, setNewResponse] = useState<AppDataRecord>(
    getAppDataByQuestionIdForMemberId(
      responses as List<AppDataQuestionRecord>,
      currentQuestion,
      memberId
    )
  );

  useEffect(() => {
    if (responses && currentQuestion) {
      // assume there's only one response for a question
      setNewResponse(
        getAppDataByQuestionIdForMemberId(
          responses as List<AppDataQuestionRecord>,
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
    setShowCorrection(true);
    if (newResponse.id) {
      patchAppData({
        id: newResponse.id,
        data: newResponse.data,
      });
    } else {
      postAppData({
        data: newResponse.data,
        type: APP_DATA_TYPES.RESPONSE,
      });
    }
  };

  if (!questions || questions.isEmpty()) {
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
          switch (currentQuestion.data.type) {
            case QuestionType.MULTIPLE_CHOICES: {
              return (
                <PlayMultipleChoices
                  choices={currentQuestion.data.choices}
                  response={newResponse.data as MultipleChoiceAppDataDataRecord}
                  setResponse={(choices) => {
                    setNewResponse(
                      newResponse.setIn(['data', 'choices'], choices)
                    );
                  }}
                  showCorrection={showCorrection}
                />
              );
            }
            case QuestionType.TEXT_INPUT: {
              return (
                <PlayTextInput
                  values={currentQuestion.data}
                  response={newResponse.data}
                  setResponse={(text: string) => {
                    setNewResponse(newResponse.setIn(['data', 'text'], text));
                  }}
                  showCorrection={showCorrection}
                />
              );
            }
            case QuestionType.FILL_BLANKS: {
              return (
                <PlayFillInTheBlanks
                  values={currentQuestion.data}
                  response={newResponse.data}
                  setResponse={(text: string) => {
                    setNewResponse(newResponse.setIn(['data', 'text'], text));
                  }}
                  showCorrection={showCorrection}
                />
              );
            }
            case QuestionType.SLIDER: {
              return (
                <PlaySlider
                  values={currentQuestion.data}
                  response={newResponse.data}
                  setResponse={(value: SliderAppDataDataRecord) => {
                    setNewResponse(
                      newResponse.update('data', (data) => data.merge(value))
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
      {showCorrection && currentQuestion.data.explanation && (
        <Grid item xs={12} width={'100%'}>
          <Typography variant="h6" mb={1}>
            {t('Explanation')}
          </Typography>
          <Typography variant="body1" mb={1} data-cy={EXPLANATION_PLAY_CY}>
            {currentQuestion.data.explanation}
          </Typography>
        </Grid>
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
