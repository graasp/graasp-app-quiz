import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import {
  Alert,
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

import {
  DEFAULT_CHOICE,
  DEFAULT_MULTIPLE_CHOICES_QUESTION,
} from '../../config/constants';
import {
  MULTIPLE_CHOICES_ADD_ANSWER_BUTTON_CY,
  MULTIPLE_CHOICES_ANSWER_CORRECTNESS_CLASSNAME,
  buildMultipleChoiceAddAnswerHintButtonCy,
  buildMultipleChoiceAnswerCy,
  buildMultipleChoiceAnswerHintCy,
  buildMultipleChoiceDeleteAnswerButtonCy,
  buildMultipleChoiceDeleteAnswerHintButtonCy,
} from '../../config/selectors';
import { QUIZ_TRANSLATIONS } from '../../langs/constants';
import { removeFromArrayAtIndex, updateArray } from '../../utils/immutable';
import { MultipleChoicesAppSettingData } from '../types/types';

type Props = {
  choices: MultipleChoicesAppSettingData['choices'];
  setChoices: (d: MultipleChoicesAppSettingData['choices']) => void;
};

const MultipleChoices = ({
  choices = DEFAULT_MULTIPLE_CHOICES_QUESTION.data.choices,
  setChoices,
}: Props): JSX.Element => {
  const { t } = useTranslation();

  // the explanation per choice is now a hint. To avoid legacy issues, the setting is still an explanation.
  const [hintList, setHintList] = useState<boolean[]>(
    choices.map((choice) => Boolean(choice.explanation))
  );

  const handleAnswerCorrectnessChange = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => setChoices(updateArray(choices, index, 'isCorrect', e.target.checked));

  const handleChoiceChange = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => setChoices(updateArray(choices, index, 'value', e.target.value));

  const handleHintChange = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => setChoices(updateArray(choices, index, 'explanation', e.target.value));

  const addAnswer = () => {
    setChoices([...choices, DEFAULT_CHOICE]);
    setHintList([...hintList, false]);
  };

  const addHint = (index: number) => {
    const newHintList = [...hintList];
    newHintList[index] = true;
    setHintList(newHintList);
  };

  const onDeleteHint = (index: number) => () => {
    const newHintList = [...hintList];
    newHintList[index] = false;
    setHintList(newHintList);
    setChoices(updateArray(choices, index, 'explanation', ''));
  };

  const onDelete = (index: number) => () => {
    // delete only possible if there's at least three choices
    if (choices.length <= 2) {
      return;
    }

    setChoices(removeFromArrayAtIndex(choices, index));
  };

  return (
    <>
      <Typography variant="h6" sx={{ pb: 2 }}>
        {t('Answers')}
      </Typography>
      <Alert sx={{ mb: 2 }} severity="info">
        {t(QUIZ_TRANSLATIONS.MULTIPLE_CORRECT_ANSWERS_AVALAIBLE_WARNING)}
      </Alert>
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
                  disabled={choices.length <= 2}
                  onClick={onDelete(index)}
                >
                  <CloseIcon />
                </IconButton>
              </Stack>
              <Stack>
                {hintList[index] || explanation ? (
                  <Stack
                    direction="row"
                    key={index}
                    justifyContent="center"
                    alignItems="center"
                  >
                    <Stack spacing={2} width="100%">
                      <TextField
                        variant="standard"
                        data-cy={buildMultipleChoiceAnswerHintCy(index)}
                        type="text"
                        label={t(
                          QUIZ_TRANSLATIONS.MULTIPLE_CHOICE_HINT_INPUT_LABEL
                        )}
                        value={explanation}
                        fullWidth
                        multiline
                        placeholder={t(
                          QUIZ_TRANSLATIONS.MULTIPLE_CHOICE_HINT_INPUT_DESCRIPTION
                        )}
                        onChange={(e) => handleHintChange(index, e)}
                      />
                    </Stack>
                    <Stack>
                      {
                        <IconButton
                          data-cy={buildMultipleChoiceDeleteAnswerHintButtonCy(
                            index
                          )}
                          type="button"
                          onClick={onDeleteHint(index)}
                        >
                          <CloseIcon />
                        </IconButton>
                      }
                    </Stack>
                  </Stack>
                ) : (
                  <Stack alignItems="flex-start">
                    <Button
                      data-cy={buildMultipleChoiceAddAnswerHintButtonCy(index)}
                      variant="text"
                      onClick={() => addHint(index)}
                      style={{ fontSize: 20 }}
                    >
                      <AddIcon fontSize="small" />
                      <Typography
                        align="center"
                        sx={{ textTransform: 'lowercase' }}
                      >
                        {t(QUIZ_TRANSLATIONS.MULTIPLE_CHOICE_ADD_HINT_BTN)}
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
            variant="outlined"
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
