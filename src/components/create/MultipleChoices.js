import React from 'react';
import { useTranslation } from 'react-i18next';

import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import {
  Checkbox,
  Fab,
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
    let newChoices = [...choices];
    newChoices[index] = { ...choices[index], isCorrect: e.target.checked };
    setChoices(newChoices);
  };

  const handleChoiceChange = (index, e) => {
    let newChoices = [...choices];
    newChoices[index] = { ...choices[index], choice: e.target.value };
    setChoices(newChoices);
  };

  const addAnswer = () => {
    setChoices([...(choices?.choices ?? []), DEFAULT_CHOICE]);
  };

  const onDelete = (index) => () => {
    // delete only possible if there's at least three choices
    if (choices.length <= 2) {
      return;
    }

    let newChoices = [...choices];
    newChoices.splice(index, 1);
    setChoices(newChoices);
  };

  return (
    <Grid container direction={'column'}>
      <Grid item sx={{ pb: 2 }}>
        <Typography variant="h6">{t('Answers')}</Typography>
      </Grid>
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
                <InputLabel>{t(`Choice ${readableIndex}`)}</InputLabel>
                <OutlinedInput
                  type="text"
                  label={`Choice ${readableIndex}`}
                  value={choice.choice}
                  placeholder={`Enter Choice ${readableIndex}`}
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
                          />
                        }
                      />
                    </InputAdornment>
                  }
                />
              </FormControl>
            </Grid>
            <Grid item xs={1}>
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

      <Grid item sx={{ pt: 2 }} align="left">
        <Fab color="primary" aria-label="add" onClick={addAnswer}>
          <AddIcon />
        </Fab>
      </Grid>
    </Grid>
  );
};

MultipleChoices.handleSave = ({ saveFn, id, data, type }) => {
  console.log(data, 'save');
  saveFn({
    id,
    data,
    type,
  });
};

export default MultipleChoices;
