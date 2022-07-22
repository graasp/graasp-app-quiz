import React, { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import { Alert, Button, Grid, Typography } from '@mui/material';

import { QUESTION_TYPES } from '../../config/constants';
import { QuizContext } from '../context/QuizContext';
import { isDifferent, validateQuestionData } from '../context/utilities';
import PlusStep from '../navigation/PlusStep';
import QuestionTopBar from '../navigation/QuestionTopBar';
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
      console.log(e);
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
        <Typography variant="h4" sx={{ pb: 4 }}>
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
            onChange={(newType) => {
              setNewData({ ...newData, type: newType });
            }}
          />
        </Grid>
        <Grid item>
          {(() => {
            switch (newData?.type) {
              case QUESTION_TYPES.TEXT_INPUT: {
                return (
                  <TextInput
                    text={newData?.value}
                    onChangeData={(value) => {
                      setNewData({
                        ...newData,
                        value,
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
        {errorMessage && (
          <Grid item>
            <Alert severity="error">{t(errorMessage)}</Alert>
          </Grid>
        )}
        <Grid container spacing={2} sx={{ pt: 2 }} justifyContent="center">
          <Grid item>
            <Button
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
