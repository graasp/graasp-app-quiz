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

import { DEFAULT_CHOICE } from '../../config/constants';

const MultipleChoices = ({ choices, setChoices }) => {
  const { t } = useTranslation();

  const handleAnswerCorrectnessChange = (index, e) => {
    let newChoices = clonedeep(choices);
    newChoices[index] = { ...choices[index], isCorrect: e.target.checked };
    setChoices(newChoices);
  };

  const handleChoiceChange = (index, e) => {
    let newChoices = clonedeep(choices);
    newChoices[index] = { ...choices[index], choice: e.target.value };
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
      {choices?.map((choice, index) => {
        const readableIndex = index + 1;
        return (
          <Grid
            container
            direction={'row'}
            key={index}
            alignItems="center"
            sx={{ pb: 2 }}
          >
            <Grid item variant="outlined" xs={11}>
              <FormControl variant="outlined" fullWidth>
                <InputLabel>{t('Answer nb', { nb: readableIndex })}</InputLabel>
                <OutlinedInput
                  type="text"
                  label={`Answer ${readableIndex}`}
                  value={choice.choice}
                  placeholder={`Enter Answer ${readableIndex}`}
                  onChange={(e) => handleChoiceChange(index, e)}
                  endAdornment={
                    <InputAdornment position="end">
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={choices[index].isCorrect}
                            onChange={(e) =>
                              handleAnswerCorrectnessChange(index, e)
                            }
                            name="answer"
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
      <Button variant="text" onClick={addAnswer}>
        <AddIcon fontSize="small" /> {t('Add Answer')}
      </Button>
    </>
  );
};

MultipleChoices.defaultProps = {
  choices: [
    { choice: '', isCorrect: true },
    { choice: '', isCorrect: false },
  ],
};

export default MultipleChoices;
