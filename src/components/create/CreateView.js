/* eslint-disable no-unused-vars */
import React, { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import DeleteIcon from '@mui/icons-material/Delete';
import { Box, Button, Grid, Typography } from '@mui/material';

import { APP_SETTING_NAMES, QUESTION_TYPES } from '../../config/constants';
import { hooks } from '../../config/queryClient';
import { MUTATION_KEYS, useMutation } from '../../config/queryClient';
import { QuizContext } from '../context/QuizContext';
import { getDataWithType, isDifferent } from '../context/utilities';
import PlusStep from '../navigation/PlusStep';
import QuestionTopBar from '../navigation/QuestionTopBar';
import MultipleChoices from './MultipleChoices';
import QuestionTitle from './QuestionTitle';
import QuestionTypeSelect from './QuestionTypeSelect';
import Slider from './Slider';
import TextInput from './TextInput';

const CreateView = () => {
  const { t } = useTranslation();
  const {
    currentQuestion,
    deleteQuestion,
    moveToPreviousQuestion,
    moveToNextQuestion,
    currentIdx,
    order,
  } = useContext(QuizContext);
  const { mutateAsync: postAppSettingAsync } = useMutation(
    MUTATION_KEYS.POST_APP_SETTING
  );
  const { mutate: postAppSetting } = useMutation(
    MUTATION_KEYS.POST_APP_SETTING
  );
  const { mutate: patchAppSetting } = useMutation(
    MUTATION_KEYS.PATCH_APP_SETTING
  );

  const [changes, setChanges] = useState(currentQuestion);

  // Flag to indicate whether any of the create screen's current data has changed, if set to false the save button will be disabled
  const [dataChanged, setDataChanged] = useState(true);

  useEffect(() => {
    setChanges(currentQuestion);
  }, [currentQuestion]);

  /**
   * Sets the type parameter to the dropdown menu's selected question type.
   *
   * @param {object} event The question type menu change event.
   */
  const handleTypeSelect = (event) => {
    setDataChanged(true);
  };

  /**
   * Creates a question and adds it to the database, then runs the provided callback function.
   *
   * @param {(number) => ()} callback callback function to be called with the id of the newly created question.
   */
  const createQuestion = async (callback) => {
    //   const { id: newAppDataId } = await postAppSettingAsync({
    //     data: {
    //       question: DEFAULT_TEXT,
    //       questionType: QUESTION_TYPES.MULTIPLE_CHOICES,
    //       choices: DEFAULT_CHOICES,
    //     },
    //     type: APP_SETTING_NAMES.QUESTION,
    //   });
    //   callback(newAppDataId);
  };

  /**
   * Creates a new question and navigates to it.
   */
  const onAddQuestion = () => {
    // createQuestion((id) => {
    //   let newQuestionList = [...questionList];
    //   const newQuestionIndex = currentQuestionIndex + 1;
    //   // Adds the newly created question's ID right after the current question's one in the question list.
    //   newQuestionList.splice(newQuestionIndex, 0, id);
    //   setQuestionList(newQuestionList);
    //   // Save the new question list.
    //   handleSave(newQuestionList);
    // });
    // let newQuestionList = [...questionList];
    // const newQuestionIndex = currentQuestionIndex + 1;
    // // Adds a temporary empty ID right after the current question's one in the question list, to be changed once the actual ID is fetched at the end of the createQuestion asynchronous function. This temporary ID prevents blocking the screen until retrieveing the new ID for the purpose of improving the user experience.
    // newQuestionList.splice(newQuestionIndex, 0, '');
    // setQuestionList(newQuestionList);
    // handleNext(newQuestionList);
  };

  /**
   * Saves the question list and question data to the database if the data is stale.
   *
   * @param {number[]} newQuestionList the current question ID list.
   */
  const handleSave = (qList) => {
    // Only save the data if it has changed
    if (dataChanged) {
      // todo: patch question in order
      // if (questionListDBId) {
      //   patchAppSetting({
      //     id: questionListDBId,
      //     data: {
      //       list: qList ?? questionList,
      //     },
      //     type: APP_SETTING_NAMES.QUESTION_LIST,
      //   });
      // }

      const saveFn = () => {
        if (!currentQuestion.id) {
          return postAppSetting;
        } else {
          return patchAppSetting;
        }
      };

      switch (changes?.data?.type) {
        case QUESTION_TYPES.MULTIPLE_CHOICES: {
          MultipleChoices.handleSave({
            saveFn: saveFn(),
            id: currentQuestion.id,
            data: changes.data,
            type: APP_SETTING_NAMES.QUESTION,
          });
          break;
        }
        case QUESTION_TYPES.TEXT_INPUT: {
          TextInput.handleSave({
            id: currentQuestion.id,
            data: changes.data,
            saveFn: saveFn(),
            type: APP_SETTING_NAMES.QUESTION,
          });
          break;
        }
        case QUESTION_TYPES.SLIDER: {
          Slider.handleSave({
            saveFn: saveFn(),
            id: currentQuestion.id,
            data: changes.data,
            type: APP_SETTING_NAMES.QUESTION,
          });
          break;
        }
      }
      setDataChanged(false);
    }
  };

  return (
    <div align="center">
      <Grid
        container
        direction={'row'}
        alignItems="center"
        justifyContent="center"
      >
        <Grid item>
          <QuestionTopBar additionalSteps={<PlusStep />} />
        </Grid>
      </Grid>
      <Typography variant="h2" sx={{ pb: 4 }}>
        {t('Create your quiz')}
      </Typography>
      <Grid container direction={'column'} align="left" spacing={3}>
        <Grid item>
          <QuestionTypeSelect
            value={currentQuestion?.data?.type}
            onChange={handleTypeSelect}
          />
        </Grid>

        <QuestionTitle
          title={currentQuestion?.data?.question}
          onChange={(t) => {
            console.log('t: ', t);
            setChanges({ ...changes, question: t });
          }}
        />
        <Grid item>
          {(() => {
            switch (currentQuestion?.data?.type) {
              case QUESTION_TYPES.TEXT_INPUT: {
                return (
                  <TextInput
                    text={changes?.data?.answer}
                    onChangeData={(answer) => {
                      setChanges({
                        ...changes,
                        data: {
                          ...(changes?.data ?? {}),
                          answer,
                        },
                      });
                    }}
                  />
                );
              }
              case QUESTION_TYPES.SLIDER: {
                return (
                  <Slider
                    data={changes?.data}
                    onChangeData={(newData) => {
                      setChanges({
                        ...changes,
                        data: {
                          ...(changes?.data ?? {}),
                          ...newData,
                        },
                      });
                    }}
                  />
                );
              }
              case QUESTION_TYPES.MULTIPLE_CHOICES:
              default: {
                return (
                  <MultipleChoices
                    choices={changes?.data?.choices}
                    setChoices={(newChoices) =>
                      setChanges({
                        ...changes,
                        data: { ...changes.data, choices: newChoices },
                      })
                    }
                  />
                );
              }
            }
          })()}
        </Grid>
        <Grid
          container
          direction={'row'}
          spacing={4}
          sx={{ py: 2 }}
          align="center"
        >
          <Grid item>
            <Button
              variant="contained"
              color="primary"
              onClick={moveToPreviousQuestion}
              disabled={currentIdx === 0}
            >
              {t('Previous')}
            </Button>
          </Grid>
          <Grid item>
            <Button
              color="error"
              variant="contained"
              startIcon={<DeleteIcon />}
              onClick={deleteQuestion(currentQuestion?.id)}
            >
              {t('Delete')}
            </Button>
          </Grid>
          <Grid item>
            <Button
              onClick={() => handleSave()}
              variant="contained"
              color="success"
              disabled={!isDifferent(changes, currentQuestion)}
            >
              {t('Save')}
            </Button>
          </Grid>
          <Grid item>
            <Button
              variant="contained"
              color="primary"
              onClick={moveToNextQuestion}
              disabled={currentIdx === order.length - 1}
            >
              {t('Next')}
            </Button>
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
};

export default CreateView;
