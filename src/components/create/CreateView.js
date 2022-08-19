import React, { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import { Alert, Button, Grid, Typography } from '@mui/material';

import { QUESTION_TYPES } from '../../config/constants';
import {
  ADD_NEW_QUESTION_TITLE_CY,
  CREATE_VIEW_DELETE_BUTTON_CY,
  CREATE_VIEW_ERROR_ALERT_CY,
  CREATE_VIEW_SAVE_BUTTON_CY,
} from '../../config/selectors';
import { QuizContext } from '../context/QuizContext';
import { isDifferent, validateQuestionData } from '../context/utilities';
import PlusStep from '../navigation/PlusStep';
import QuestionTopBar from '../navigation/QuestionTopBar';
import Explanation from './Explanation';
import MultipleChoices from './MultipleChoices';
import QuestionTitle from './QuestionTitle';
import QuestionTypeSelect from './QuestionTypeSelect';
import Slider from './Slider';
import TextInput from './TextInput';

const CreateView = () => {
  const { t } = useTranslation();
  const { currentQuestion, deleteQuestion, addQuestion, saveQuestion } =
    useContext(QuizContext);

  const [newData, setNewData] = useState(currentQuestion?.data);
  const [errorMessage, setErrorMessage] = useState();
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    setNewData(currentQuestion?.data);
  }, [currentQuestion]);

  // validate data to enable save
  useEffect(() => {
    if (isSubmitted) {
      try {
        validateQuestionData(newData);
        setErrorMessage(null);
      } catch (e) {
        setErrorMessage(e);
      }
    }
  }, [newData, isSubmitted]);

  const saveNewQuestion = () => {
    setIsSubmitted(true);
    try {
      validateQuestionData(newData);
      setErrorMessage(null);
      saveQuestion(newData);
    } catch (e) {
      setErrorMessage(e);
    }
  };

  return (
    <>
      <Grid
        container
        direction={'row'}
        alignItems="center"
        justifyContent="center"
      >
        <Grid item>
          <QuestionTopBar
            additionalSteps={<PlusStep onClick={addQuestion} />}
          />
        </Grid>
      </Grid>
      {!currentQuestion?.id && (
        <Typography
          variant="h4"
          sx={{ pb: 4 }}
          data-cy={ADD_NEW_QUESTION_TITLE_CY}
        >
          {t('Add a new question')}
        </Typography>
      )}
      <Grid container direction={'column'} align="left" spacing={3}>
        <Grid item>
          <QuestionTitle
            title={newData?.question}
            onChange={(question) => {
              setNewData({ ...newData, question });
            }}
          />
        </Grid>
        <Grid item>
          <QuestionTypeSelect
            value={newData?.type}
            onChange={(changes) => {
              setNewData({ ...newData, ...changes });
            }}
          />
        </Grid>
        <Grid item>
          {(() => {
            switch (newData?.type) {
              case QUESTION_TYPES.TEXT_INPUT: {
                return (
                  <TextInput
                    text={newData?.text}
                    onChangeData={(text) => {
                      setNewData({
                        ...newData,
                        text,
                      });
                    }}
                  />
                );
              }
              case QUESTION_TYPES.SLIDER: {
                return (
                  <Slider
                    data={newData}
                    onChangeData={(d) => {
                      setNewData({
                        ...newData,
                        ...d,
                      });
                    }}
                  />
                );
              }
              case QUESTION_TYPES.MULTIPLE_CHOICES:
              default: {
                return (
                  <MultipleChoices
                    choices={newData?.choices}
                    setChoices={(newChoices) =>
                      setNewData({ ...newData, choices: newChoices })
                    }
                  />
                );
              }
            }
          })()}
        </Grid>

        <Grid item>
          <Explanation
            value={newData?.explanation}
            onChange={(explanation) => {
              setNewData({ ...newData, explanation });
            }}
          />
        </Grid>
        {errorMessage && (
          <Grid item>
            <Alert severity="error" data-cy={CREATE_VIEW_ERROR_ALERT_CY}>
              {t(errorMessage)}
            </Alert>
          </Grid>
        )}
        <Grid container spacing={2} sx={{ pt: 2 }} justifyContent="center">
          <Grid item>
            <Button
              data-cy={CREATE_VIEW_DELETE_BUTTON_CY}
              color="error"
              variant="contained"
              startIcon={<DeleteIcon />}
              onClick={deleteQuestion(currentQuestion?.id)}
              disabled={!currentQuestion.id}
            >
              {t('Delete')}
            </Button>
          </Grid>
          <Grid item>
            <Button
              data-cy={CREATE_VIEW_SAVE_BUTTON_CY}
              onClick={saveNewQuestion}
              variant="contained"
              color="success"
              startIcon={<SaveIcon />}
              disabled={
                !isDifferent(newData, currentQuestion?.data) || errorMessage
              }
            >
              {t('Save')}
            </Button>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
};

export default CreateView;
