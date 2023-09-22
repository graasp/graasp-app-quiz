import { List } from 'immutable';

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import {
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Stack,
  TextField,
  Typography,
} from '@mui/material';

import { DEFAULT_CHOICE, DEFAULT_QUESTION } from '../../config/constants';
import {
  MULTIPLE_CHOICES_ADD_ANSWER_BUTTON_CY,
  MULTIPLE_CHOICES_ANSWER_CORRECTNESS_CLASSNAME,
  buildMultipleChoiceAddAnswerExplanationButtonCy,
  buildMultipleChoiceAnswerCy,
  buildMultipleChoiceAnswerExplanationCy,
  buildMultipleChoiceDeleteAnswerButtonCy,
  buildMultipleChoiceDeleteAnswerExplanationButtonCy,
} from '../../config/selectors';
import { MultipleChoicesAppSettingDataRecord } from '../types/types';

type Props = {
  choices: MultipleChoicesAppSettingDataRecord['choices'];
  setChoices: (d: MultipleChoicesAppSettingDataRecord['choices']) => void;
};

const MultipleChoices = ({
  choices = DEFAULT_QUESTION.data.choices,
  setChoices,
}: Props): JSX.Element => {
  const { t } = useTranslation();

  const [explanationList, setExplanationList] = useState<List<boolean>>(
    List(choices.map((choice) => Boolean(choice.explanation)))
  );

  const handleAnswerCorrectnessChange = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const d = choices.setIn([index, 'isCorrect'], e.target.checked);
    setChoices(d);
  };

  const handleChoiceChange = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const d = choices.setIn([index, 'value'], e.target.value);
    setChoices(d);
  };

  const handleExplanationChange = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const d = choices.setIn([index, 'explanation'], e.target.value);
    setChoices(d);
  };

  const addAnswer = () => {
    setChoices(choices.push(DEFAULT_CHOICE));
    setExplanationList(explanationList.push(false));
  };

  const addExplanation = (index: number) => {
    const newExplanationList = [...explanationList];
    newExplanationList[index] = true;
    setExplanationList(List(newExplanationList));
  };

  const onDeleteExplanation = (index: number) => () => {
    const newExplanationList = [...explanationList];
    newExplanationList[index] = false;
    setExplanationList(List(newExplanationList));
    const newExplanation = choices.setIn([index, 'explanation'], '');
    setChoices(newExplanation);
  };

  const onDelete = (index: number) => () => {
    // delete only possible if there's at least three choices
    if (choices.size <= 2) {
      return;
    }

    setChoices(choices.delete(index));
  };

  return (
    <>
      <Typography variant="h6" sx={{ pb: 2 }}>
        {t('Answers')}
      </Typography>
      <Stack direction="column" spacing={2}>
        {choices?.map(({ value, isCorrect, explanation }, index) => {
          const readableIndex = index + 1;
          return (
            <Stack
              key={index}
              direction="column"
              sx={{ p: 2, background: '#efefef', borderRadius: 1 }}
              spacing={2}
            >
              <Stack direction="row" sx={{ width: '100%' }}>
                <FormControl variant="outlined" fullWidth>
                  <InputLabel>{t('Value')}</InputLabel>
                  <OutlinedInput
                    data-cy={buildMultipleChoiceAnswerCy(index)}
                    type="text"
                    label={t(`Value`)}
                    value={value}
                    placeholder={t(`Enter Answer ${readableIndex}`)}
                    onChange={(e) => handleChoiceChange(index, e)}
                    endAdornment={
                      <InputAdornment position="end">
                        <FormControlLabel
                          label=""
                          control={
                            <Checkbox
                              className={
                                MULTIPLE_CHOICES_ANSWER_CORRECTNESS_CLASSNAME
                              }
                              checked={isCorrect}
                              onChange={(e) =>
                                handleAnswerCorrectnessChange(index, e)
                              }
                              edge="end"
                              sx={{ p: 0 }}
                            />
                          }
                        />
                      </InputAdornment>
                    }
                  />
                </FormControl>
                <IconButton
                  data-cy={buildMultipleChoiceDeleteAnswerButtonCy(index)}
                  type="button"
                  disabled={choices.size <= 2}
                  onClick={onDelete(index)}
                >
                  <CloseIcon />
                </IconButton>
              </Stack>
              <Stack>
                {explanationList.get(index) || explanation ? (
                  <Stack
                    direction="row"
                    key={index}
                    justifyContent="center"
                    alignItems="center"
                  >
                    <Stack spacing={2} width="100%">
                      <TextField
                        variant="standard"
                        data-cy={buildMultipleChoiceAnswerExplanationCy(index)}
                        type="text"
                        label={`Explanation`}
                        value={explanation}
                        fullWidth
                        multiline
                        placeholder={t(
                          'Type here an explanation on the correctness of this answer'
                        )}
                        onChange={(e) => handleExplanationChange(index, e)}
                      />
                    </Stack>
                    <Stack>
                      {
                        <IconButton
                          data-cy={buildMultipleChoiceDeleteAnswerExplanationButtonCy(
                            index
                          )}
                          type="button"
                          onClick={onDeleteExplanation(index)}
                        >
                          <CloseIcon />
                        </IconButton>
                      }
                    </Stack>
                  </Stack>
                ) : (
                  <Stack alignItems="flex-start">
                    <Button
                      data-cy={buildMultipleChoiceAddAnswerExplanationButtonCy(
                        index
                      )}
                      variant="text"
                      onClick={() => addExplanation(index)}
                      style={{ fontSize: 20 }}
                    >
                      <AddIcon fontSize="small" />
                      <Typography
                        align="center"
                        sx={{ textTransform: 'lowercase' }}
                      >
                        {t('Add Explanation')}
                      </Typography>
                    </Button>
                  </Stack>
                )}
              </Stack>
            </Stack>
          );
        })}
        <Stack alignItems="flex-start">
          <Button
            variant="contained"
            color="primary"
            onClick={addAnswer}
            data-cy={MULTIPLE_CHOICES_ADD_ANSWER_BUTTON_CY}
          >
            <AddIcon fontSize="small" sx={{ pr: 0.5 }} /> {t('Add Answer')}
          </Button>
        </Stack>
      </Stack>
    </>
  );
};

export default MultipleChoices;
