import clonedeep from 'lodash.clonedeep';

import React from 'react';

import CheckIcon from '@mui/icons-material/Check';
import { Button, Grid } from '@mui/material';

const PlayMultipleChoices = ({
  choices,
  response,
  setResponse,
  showCorrection,
}) => {
  const onResponseClick = (e) => {
    // toggle selected choice
    const { value } = e.target;
    let newResponse = clonedeep(response.choices || []);
    const choiceIdx = response.choices?.findIndex((choice) => choice === value);
    if (choiceIdx >= 0) {
      newResponse.splice(choiceIdx, 1);
    } else {
      newResponse.push(value);
    }
    setResponse(newResponse);
  };

  const computeStyles = ({ choice, isCorrect }) => {
    const isSelected = response.choices?.includes(choice);
    if (showCorrection) {
      switch (true) {
        case isCorrect && isSelected:
          return {
            color: 'success',
            variant: 'contained',
            endIcon: <CheckIcon />,
          };
        case isCorrect && !isSelected:
          return {
            color: 'error',
            variant: 'contained',
            endIcon: <CheckIcon />,
          };
        case !isCorrect && isSelected:
          return { color: 'error', variant: 'contained' };
        default:
          return { color: 'primary', variant: 'outlined' };
      }
    }

    return { color: 'primary', variant: isSelected ? 'contained' : 'outlined' };
  };

  return (
    <Grid container direction={'column'} spacing={2}>
      {choices?.map((choice) => (
        <Grid item key={choice.choice}>
          <Button
            value={choice.choice}
            onClick={onResponseClick}
            fullWidth
            {...computeStyles(choice)}
          >
            {choice.choice}
          </Button>
        </Grid>
      ))}
    </Grid>
  );
};

export default PlayMultipleChoices;
