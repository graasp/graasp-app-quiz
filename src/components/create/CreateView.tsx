import { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import { Alert, Button, Grid, Typography } from '@mui/material';

import { QuestionType } from '../../config/constants';
import {
  ADD_NEW_QUESTION_TITLE_CY,
  CREATE_VIEW_CONTAINER_CY,
  CREATE_VIEW_DELETE_BUTTON_CY,
  CREATE_VIEW_ERROR_ALERT_CY,
  CREATE_VIEW_SAVE_BUTTON_CY,
} from '../../config/selectors';
import { QuizContext } from '../context/QuizContext';
import { isDifferent, validateQuestionData } from '../context/utilities';
import {
  MultipleChoicesAppSettingData,
  SliderAppSettingData,
} from '../types/types';
import { QuestionData } from '../types/types';
import CreateQuestionTopBar from './CreateQuestionTopBar';
import Explanation from './Explanation';
import FillInTheBlanks from './FillInTheBlanks';
import MultipleChoices from './MultipleChoices';
import NumberOfAttempts from './NumberOfAttempts';
import QuestionTitle from './QuestionTitle';
import QuestionTypeSelect from './QuestionTypeSelect';
import Slider from './Slider';
import TextInput from './TextInput';

type ValidationSeverity = 'warning' | 'error';

type ValidationMessage = {
  msg: string;
  severity: ValidationSeverity;
};

const CreateView = () => {
  const { t } = useTranslation();
  const { currentQuestion, deleteQuestion, saveQuestion, currentIdx } =
    useContext(QuizContext);

  const [newData, setNewData] = useState<QuestionData>(currentQuestion.data);
  const [errorMessage, setErrorMessage] = useState<ValidationMessage | null>();
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Reset is submitted when currentIdx changed to 
  // display errorMessage with the correct severity.
  useEffect(() => {
    setIsSubmitted(false);
  }, [currentIdx]);

  useEffect(() => {
    setNewData(currentQuestion.data as QuestionData);
  }, [currentQuestion]);

  // validate data to enable save
  useEffect(() => {
    try {
      validateQuestionData(newData);
      setErrorMessage(null);
    } catch (e) {
      setErrorMessage({
        msg: e as string,
        severity: isSubmitted ? 'error' : 'warning',
      });
    }
  }, [newData, isSubmitted]);

  const saveNewQuestion = () => {
    setIsSubmitted(true);
    try {
      validateQuestionData(newData);
      setErrorMessage(null);
      saveQuestion(newData);
    } catch (e) {
      setErrorMessage({
        msg: e as string,
        severity: 'error',
      });
    }
  };

  return (
    <>
      <Grid
        container
        direction="row"
        alignItems="center"
        justifyContent="center"
        data-cy={CREATE_VIEW_CONTAINER_CY}
      >
        <Grid item width={'100%'}>
          <CreateQuestionTopBar />
        </Grid>
      </Grid>
      {!currentQuestion.id && (
        <Typography
          variant="h4"
          sx={{ pb: 4 }}
          data-cy={ADD_NEW_QUESTION_TITLE_CY}
        >
          {t('Add a new question')}
        </Typography>
      )}
      <Grid container direction="column" spacing={3}>
        <Grid item>
          <QuestionTitle
            title={newData.question}
            onChange={(question: string) => {
              setNewData({
                ...newData,
                question,
              });
            }}
          />
        </Grid>
        <Grid item>
          <QuestionTypeSelect
            value={newData.type}
            onChange={(changes: QuestionData) => {
              setNewData({
                ...changes,
                questionId: newData.questionId,
                question: newData.question,
                explanation: newData.explanation,
                numberOfAttempts: newData.numberOfAttempts,
              });
            }}
          />
        </Grid>
        <Grid item>
          {(() => {
            switch (newData.type) {
              case QuestionType.TEXT_INPUT: {
                return (
                  <TextInput
                    text={newData.text}
                    onChangeData={(text: string) => {
                      setNewData({
                        ...newData,
                        text,
                      });
                    }}
                  />
                );
              }
              case QuestionType.SLIDER: {
                return (
                  <Slider
                    data={newData}
                    onChangeData={(d: SliderAppSettingData) => {
                      setNewData({
                        ...newData,
                        ...d,
                      });
                    }}
                  />
                );
              }
              case QuestionType.FILL_BLANKS: {
                return (
                  <FillInTheBlanks
                    text={newData.text}
                    onChangeData={(text: string) =>
                      setNewData({
                        ...newData,
                        text,
                      })
                    }
                  />
                );
              }
              case QuestionType.MULTIPLE_CHOICES:
              default: {
                return (
                  <MultipleChoices
                    choices={newData.choices}
                    setChoices={(
                      newChoices: MultipleChoicesAppSettingData['choices']
                    ) =>
                      setNewData({
                        ...newData,
                        choices: newChoices,
                      })
                    }
                  />
                );
              }
            }
          })()}

          <NumberOfAttempts
            initAttempts={currentQuestion.data.numberOfAttempts}
            onChange={(attempts: number) => {
              setNewData({
                ...newData,
                numberOfAttempts: attempts,
              });
            }}
          />
        </Grid>

        <Grid item>
          <Explanation
            value={newData.explanation}
            onChange={(explanation: string) => {
              setNewData({
                ...newData,
                explanation,
              });
            }}
          />
        </Grid>
        {errorMessage && (
          <Grid item>
            <Alert
              severity={errorMessage.severity}
              data-cy={CREATE_VIEW_ERROR_ALERT_CY}
            >
              {t(errorMessage.msg)}
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
              onClick={deleteQuestion(currentQuestion)}
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
                !isDifferent(newData, currentQuestion.data) ||
                Boolean(errorMessage)
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
