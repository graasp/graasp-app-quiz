import { useContext, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import {
  Alert,
  Box,
  Button,
  Grid,
  Stack,
  TextField,
  Typography,
} from '@mui/material';

import { QuestionType } from '../../config/constants';
import {
  ADD_NEW_QUESTION_TITLE_CY,
  CREATE_VIEW_CONTAINER_CY,
  CREATE_VIEW_DELETE_BUTTON_CY,
  CREATE_VIEW_ERROR_ALERT_CY,
  CREATE_VIEW_SAVE_BUTTON_CY,
  EXPLANATION_CY,
  HINTS_CY,
} from '../../config/selectors';
import { QUIZ_TRANSLATIONS } from '../../langs/constants';
import { QuizContext } from '../context/QuizContext';
import { isDifferent } from '../context/utilities';
import MoveQuestionSection from '../navigation/builderNavigation/MoveQuestionSection';
import { QuizNavigationBuilder } from '../navigation/builderNavigation/QuizNavigation';
import {
  MultipleChoicesAppSettingData,
  QuestionData,
  SliderAppSettingData,
} from '../types/types';
import FillInTheBlanks from './FillInTheBlanks';
import MultipleChoices from './MultipleChoices';
import NumberOfAttempts from './NumberOfAttempts';
import QuestionTitle from './QuestionTitle';
import QuestionTypeSelect from './QuestionTypeSelect';
import Section from './Section';
import Slider from './Slider';
import TextInput from './TextInput';

const flexItemSx = {
  flex: '0 0',
  position: 'relative',
};

const flexItemQuestionSx = {
  display: 'box',
  height: 'auto',
};

const flexItemNavSx = {
  position: { md: 'absolute', sm: 'relative' },
  top: 0,
  bottom: 0,
};

const CreateView = () => {
  const { t } = useTranslation();
  const {
    currentQuestion,
    newData,
    setNewData,
    deleteQuestion,
    saveQuestion,
    errorMessage,
  } = useContext(QuizContext);

  const disableSaveButton =
    !isDifferent(newData, currentQuestion.data) || Boolean(errorMessage);

  useEffect(() => {
    setNewData(currentQuestion.data as QuestionData);
  }, [currentQuestion, setNewData]);

  const saveNewQuestion = () => {
    saveQuestion(newData).catch((e) => console.error(e));
  };

  return (
    <>
      <Box
        sx={{
          ...flexItemSx,
          flexBasis: '100%',
          mb: 4,
        }}
      >
        <Alert variant="standard" severity="info">
          {t(QUIZ_TRANSLATIONS.CREATE_QUIZ_NOT_EXAM_SOLUTION_WARNING)}
        </Alert>
      </Box>
      <Box
        display="flex"
        flexDirection={{ xs: 'column', md: 'row' }}
        justifyContent="space-between"
        data-cy={CREATE_VIEW_CONTAINER_CY}
      >
        <Box
          sx={{
            ...flexItemSx,
            flexBasis: { md: '30%', sm: '100%' },
            mb: { xs: 2, md: 0 },
          }}
        >
          <QuizNavigationBuilder sx={flexItemNavSx} />
        </Box>
        <Box sx={{ ...flexItemSx, flexBasis: { md: '60%', sm: '100%' } }}>
          <Stack sx={flexItemQuestionSx}>
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
                <Section
                  sx={{ mt: 2 }}
                  title={t(QUIZ_TRANSLATIONS.MULTIPLE_ATTEMPTS_SECTION_TITLE)}
                  explanation={t(
                    QUIZ_TRANSLATIONS.MULTIPLE_ATTEMPTS_EXPLANATION,
                    { count: newData.numberOfAttempts ?? 0 }
                  )}
                >
                  <NumberOfAttempts
                    initAttempts={currentQuestion.data.numberOfAttempts}
                    onChange={(attempts: number) => {
                      setNewData({
                        ...newData,
                        numberOfAttempts: attempts,
                      });
                    }}
                  />
                </Section>
              </Grid>
              <Grid item>
                <Section
                  title={t(QUIZ_TRANSLATIONS.HINTS_TITLE)}
                  explanation={t(QUIZ_TRANSLATIONS.HINTS_SUB_TITLE)}
                >
                  <TextField
                    data-cy={HINTS_CY}
                    fullWidth
                    label={t(QUIZ_TRANSLATIONS.HINTS_LABEL)}
                    value={newData.hints ?? ''}
                    variant="outlined"
                    onChange={(e) => {
                      setNewData({
                        ...newData,
                        hints: e.target.value,
                      });
                    }}
                    multiline
                  />
                </Section>
              </Grid>
              <Grid item>
                <Section
                  title={t('Explanation')}
                  explanation={t(
                    'Type here an explanation that will be displayed after an answer is submitted'
                  )}
                >
                  <TextField
                    data-cy={EXPLANATION_CY}
                    fullWidth
                    label={t('Explanation')}
                    value={newData.explanation}
                    variant="outlined"
                    onChange={(e) => {
                      setNewData({
                        ...newData,
                        explanation: e.target.value,
                      });
                    }}
                    multiline
                  />
                </Section>
              </Grid>
              {currentQuestion.id && (
                <Grid item>
                  <MoveQuestionSection qId={currentQuestion.data.questionId} />
                </Grid>
              )}
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
              <Grid
                container
                spacing={2}
                sx={{ pt: 2 }}
                justifyContent="center"
              >
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
                    disabled={disableSaveButton}
                  >
                    {t('Save')}
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          </Stack>
        </Box>
      </Box>
    </>
  );
};

export default CreateView;
