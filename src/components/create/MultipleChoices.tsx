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
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Typography,
} from '@mui/material';

import { DEFAULT_CHOICE, DEFAULT_QUESTION } from '../../config/constants';
import {
  MULTIPLE_CHOICES_ADD_ANSWER_BUTTON_CY,
  MULTIPLE_CHOICES_ANSWER_CORRECTNESS_CLASSNAME,
  buildMultipleChoiceAnswerCy,
  buildMultipleChoiceDeleteAnswerButtonCy,
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
    List([false, false])
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
  };

  const addExplanation = (index: number) => {
    const newExplanationList = [...explanationList];
    newExplanationList[index] = true;
    setExplanationList(List(newExplanationList));
  };

  const onDeleteExplanation = (index: number) => {
    const newExplanationList = [...explanationList];
    newExplanationList[index] = false;
    setExplanationList(List(newExplanationList));
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
      {choices?.map(({ value, isCorrect, explanation }, index) => {
        const readableIndex = index + 1;
        return (
          <Grid container direction="column" sx={{ pb: 2 }}>
            <Grid
              item
              xs
              style={{ display: 'flex', justifyContent: 'flex-start' }}
            >
              <Grid container direction="row" key={index} alignItems="center">
                <Grid item xs={11}>
                  <FormControl variant="outlined" fullWidth>
                    <InputLabel>
                      {t('Answer nb', { nb: readableIndex })}
                    </InputLabel>
                    <OutlinedInput
                      data-cy={buildMultipleChoiceAnswerCy(index)}
                      type="text"
                      label={`Answer ${readableIndex}`}
                      value={value}
                      placeholder={`Enter Answer ${readableIndex}`}
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
                </Grid>
                <Grid item xs={1} sx={{ textAlign: 'center' }}>
                  {
                    <IconButton
                      data-cy={buildMultipleChoiceDeleteAnswerButtonCy(index)}
                      type="button"
                      disabled={choices.size <= 2}
                      onClick={onDelete(index)}
                    >
                      <CloseIcon />
                    </IconButton>
                  }
                </Grid>
              </Grid>
            </Grid>
            {explanationList.get(index) || explanation ? (
              <Grid container direction="column" key={index}>
                <Grid item sx={{ paddingTop: 1.5 }}>
                  <Typography variant="subtitle2" mb={1}>
                    {t(
                      'Type here an explanation on the correctness of this answer'
                    )}
                  </Typography>
                </Grid>
                <Grid item>
                  <Grid
                    container
                    direction="row"
                    key={index}
                    alignItems="center"
                  >
                    <Grid
                      item
                      xs={11}
                      style={{ display: 'flex', alignItems: 'center' }}
                    >
                      <FormControl variant="outlined" fullWidth>
                        <InputLabel>
                          {t(`Explanation ${readableIndex}`)}
                        </InputLabel>
                        <OutlinedInput
                          type="text"
                          label={`Explanation ${readableIndex}`}
                          value={explanation}
                          placeholder={`Enter Explanation ${readableIndex}`}
                          onChange={(e) => handleExplanationChange(index, e)}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item xs={1} sx={{ textAlign: 'center' }}>
                      {
                        <IconButton
                          type="button"
                          onClick={() => onDeleteExplanation(index)}
                        >
                          <CloseIcon />
                        </IconButton>
                      }
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            ) : (
              <Grid item xs style={{ display: 'flex', alignItems: 'center' }}>
                <Button
                  variant="text"
                  onClick={() => addExplanation(index)}
                  data-cy={index}
                  style={{ fontSize: 20 }}
                >
                  <AddIcon fontSize="small" />{' '}
                  <Typography
                    align="center"
                    sx={{ textTransform: 'lowercase' }}
                  >
                    {t('Add Explanation')}
                  </Typography>
                </Button>
              </Grid>
            )}
          </Grid>
        );
      })}
      <Button
        variant="contained"
        color="primary"
        onClick={addAnswer}
        data-cy={MULTIPLE_CHOICES_ADD_ANSWER_BUTTON_CY}
      >
        <AddIcon fontSize="small" sx={{ pr: 0.5 }} /> {t('Add Answer')}
      </Button>
    </>
  );
};

export default MultipleChoices;
