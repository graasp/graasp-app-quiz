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
import PlusStep from '../navigation/PlusStep';
import QuestionTopBar from '../navigation/QuestionTopBar';
import {
  AppSettingDataRecord,
  MultipleChoicesAppSettingDataRecord,
  SliderAppSettingDataRecord,
} from '../types/types';
import { QuestionDataRecord } from '../types/types';
import Explanation from './Explanation';
import FillInTheBlanks from './FillInTheBlanks';
import MultipleChoices from './MultipleChoices';
import QuestionTitle from './QuestionTitle';
import QuestionTypeSelect from './QuestionTypeSelect';
import Slider from './Slider';
import TextInput from './TextInput';

const CreateView = () => {
  const { t } = useTranslation();
  const { currentQuestion, deleteQuestion, addQuestion, saveQuestion } =
    useContext(QuizContext);

  const [newData, setNewData] = useState<QuestionDataRecord>(
    currentQuestion?.data as QuestionDataRecord
  );
  const [errorMessage, setErrorMessage] = useState<string | null>();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isValid, setIsValid] = useState(true);

  useEffect(() => {
    setNewData(currentQuestion?.data as QuestionDataRecord);
  }, [currentQuestion]);

  // validate data to enable save
  useEffect(() => {
    if (isSubmitted) {
      try {
        validateQuestionData(newData);
        setErrorMessage(null);
      } catch (e) {
        setErrorMessage(e as string);
      }
    }
  }, [newData, isSubmitted]);
  
  useEffect(() => {
      try {
        validateQuestionData(newData);
        setIsValid(true);
      } catch (e) {
        setIsValid(false);
      }
    
  }, [newData]);

  const saveNewQuestion = () => {
    setIsSubmitted(true);
    try {
      validateQuestionData(newData);
      setErrorMessage(null);
      saveQuestion(newData);
    } catch (e) {
      setErrorMessage(e as string);
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
      <Grid container direction="column" spacing={3}>
        <Grid item>
          <QuestionTitle
            title={newData?.question}
            onChange={(question: string) => {
              setNewData(
                (newData as AppSettingDataRecord).set(
                  'question',
                  question
                ) as QuestionDataRecord
              );
            }}
          />
        </Grid>
        <Grid item>
          <QuestionTypeSelect
            value={newData?.type}
            onChange={(changes: QuestionDataRecord) => {
              setNewData(
                (changes as AppSettingDataRecord)
                  .set('question', newData.question)
                  .set('explanation', newData.explanation) as QuestionDataRecord
              );
            }}
          />
        </Grid>
        <Grid item>
          {(() => {
            switch (newData?.type) {
              case QuestionType.TEXT_INPUT: {
                return (
                  <TextInput
                    text={newData?.text}
                    onChangeData={(text: string) => {
                      setNewData(newData.set('text', text));
                    }}
                  />
                );
              }
              case QuestionType.SLIDER: {
                return (
                  <Slider
                    data={newData}
                    onChangeData={(d: SliderAppSettingDataRecord) => {
                      setNewData(newData.merge(d));
                    }}
                  />
                );
              }
              case QuestionType.FILL_BLANKS: {
                return (
                  <FillInTheBlanks
                    text={newData?.text}
                    onChangeData={(text: string) =>
                      setNewData(newData.set('text', text))
                    }
                  />
                );
              }
              case QuestionType.MULTIPLE_CHOICES:
              default: {
                return (
                  <MultipleChoices
                    choices={newData?.choices}
                    setChoices={(
                      newChoices: MultipleChoicesAppSettingDataRecord['choices']
                    ) => setNewData(newData.set('choices', newChoices))}
                  />
                );
              }
            }
          })()}
        </Grid>

        <Grid item>
          <Explanation
            value={newData?.explanation}
            onChange={(explanation: string) => {
              setNewData(
                (newData as AppSettingDataRecord).set(
                  'explanation',
                  explanation
                ) as QuestionDataRecord
              );
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
                !isDifferent(newData, currentQuestion?.data) ||
                Boolean(errorMessage) || !isValid
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
