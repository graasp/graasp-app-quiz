import clonedeep from 'lodash.clonedeep';

import React from 'react';
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

const MultipleChoices = ({ choices, setChoices }) => {
  const { t } = useTranslation();

  const handleAnswerCorrectnessChange = (index, e) => {
    let newChoices = clonedeep(choices);
    newChoices[index] = { ...choices[index], isCorrect: e.target.checked };
    setChoices(newChoices);
  };

  const handleChoiceChange = (index, e) => {
    let newChoices = clonedeep(choices);
    newChoices[index] = { ...choices[index], value: e.target.value };
    setChoices(newChoices);
  };

  const addAnswer = () => {
    setChoices([...choices, DEFAULT_CHOICE]);
  };

  const onDelete = (index) => () => {
    // delete only possible if there's at least three choices
    if (choices.length <= 2) {
      return;
    }

    let newChoices = clonedeep(choices);
    newChoices.splice(index, 1);
    setChoices(newChoices);
  };

  return (
    <>
      <Typography variant="h6" sx={{ pb: 2 }}>
        {t('Answers')}
      </Typography>
      {choices?.map(({ value, isCorrect }, index) => {
        const readableIndex = index + 1;
        return (
          <Grid
            container
            direction="row"
            key={index}
            alignItems="center"
            sx={{ pb: 2 }}
          >
            <Grid item variant="outlined" xs={11}>
              <FormControl variant="outlined" fullWidth>
                <InputLabel>{t('Answer nb', { nb: readableIndex })}</InputLabel>
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
                  disabled={choices.length <= 2}
                  onClick={onDelete(index)}
                >
                  <CloseIcon />
                </IconButton>
              }
            </Grid>
          </Grid>
        );
      })}
      <Button
        variant="text"
        onClick={addAnswer}
        data-cy={MULTIPLE_CHOICES_ADD_ANSWER_BUTTON_CY}
      >
        <AddIcon fontSize="small" /> {t('Add Answer')}
      </Button>
    </>
  );
};

MultipleChoices.defaultProps = {
  choices: DEFAULT_QUESTION.data.choices,
};

export default MultipleChoices;
