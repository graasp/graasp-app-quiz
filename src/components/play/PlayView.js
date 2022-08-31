import React, { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import {
  Alert,
  Button,
  CircularProgress,
  Grid,
  Typography,
} from '@mui/material';

import { APP_DATA_TYPES, QUESTION_TYPES } from '../../config/constants';
import { MUTATION_KEYS, hooks, useMutation } from '../../config/queryClient';
import {
  EXPLANATION_PLAY_CY,
  PLAY_VIEW_EMPTY_QUIZ_CY,
  PLAY_VIEW_QUESTION_TITLE_CY,
  PLAY_VIEW_SUBMIT_BUTTON_CY,
} from '../../config/selectors';
import { QuizContext } from '../context/QuizContext';
import { getAppDataByQuestionId } from '../context/utilities';
import QuestionTopBar from '../navigation/QuestionTopBar';
import PlayMultipleChoices from '../play/PlayMultipleChoices';
import PlaySlider from './PlaySlider';
import PlayTextInput from './PlayTextInput';

const PlayView = () => {
  const { t } = useTranslation();
  const { data: responses, isLoading } = hooks.useAppData();
  const { mutate: postAppData } = useMutation(MUTATION_KEYS.POST_APP_DATA);
  const { mutate: patchAppData } = useMutation(MUTATION_KEYS.PATCH_APP_DATA);

  const { currentQuestion, questions } = useContext(QuizContext);

  const [showCorrection, setShowCorrection] = React.useState(false);

  const [newResponse, setNewResponse] = useState(
    getAppDataByQuestionId(responses, currentQuestion?.id)
  );

  useEffect(() => {
    if (responses && currentQuestion) {
      // assume there's only one response for a question
      setNewResponse(getAppDataByQuestionId(responses, currentQuestion.id));
    }
  }, [responses, currentQuestion]);

  useEffect(() => {
    setShowCorrection(newResponse?.id);
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

  if (isLoading) {
    return <CircularProgress />;
  }

  if (!questions || questions.isEmpty()) {
    return (
      <Alert severity="info" data-cy={PLAY_VIEW_EMPTY_QUIZ_CY}>
        {t('The quiz has not been defined')}
      </Alert>
    );
  }

  if (!currentQuestion) {
    return 'no current question';
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
            case QUESTION_TYPES.MULTIPLE_CHOICES: {
              return (
                <PlayMultipleChoices
                  choices={currentQuestion.data.choices}
                  response={newResponse.data}
                  setResponse={(choices) => {
                    setNewResponse({
                      ...newResponse,
                      data: {
                        ...newResponse.data,
                        choices,
                      },
                    });
                  }}
                  showCorrection={showCorrection}
                />
              );
            }
            case QUESTION_TYPES.TEXT_INPUT: {
              return (
                <PlayTextInput
                  values={currentQuestion.data}
                  response={newResponse.data}
                  setResponse={(text) => {
                    setNewResponse({
                      ...newResponse,
                      data: {
                        ...newResponse.data,
                        text,
                      },
                    });
                  }}
                  showCorrection={showCorrection}
                />
              );
            }
            case QUESTION_TYPES.SLIDER: {
              return (
                <PlaySlider
                  values={currentQuestion.data}
                  response={newResponse.data}
                  setResponse={(value) => {
                    setNewResponse({
                      ...newResponse,
                      data: {
                        ...newResponse.data,
                        value,
                      },
                    });
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
