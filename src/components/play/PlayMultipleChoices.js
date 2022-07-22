import clonedeep from 'lodash.clonedeep';

import React from 'react';

import CheckIcon from '@mui/icons-material/Check';
import { Button, Grid } from '@mui/material';

// TODO: use clonedeep
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

  function selectColor({ choice, isCorrect }) {
    const isSelected = response.choices?.includes(choice);
    if (showCorrection) {
      switch (true) {
        case isCorrect && isSelected:
          return 'success';
        case isCorrect && !isSelected:
        case !isCorrect && isSelected:
          return 'error';
        default:
          'primary';
      }
    }

    return isSelected ? 'secondary' : 'primary';
  }

  return (
    <Grid container direction={'column'} spacing={2}>
      {choices?.map((choice) => (
        <Grid item key={choice}>
          <Button
            value={choice.choice}
            onClick={onResponseClick}
            variant="contained"
            color={selectColor(choice)}
            sx={{ py: 2, borderColor: 'black' }}
            endIcon={showCorrection && choice.isCorrect && <CheckIcon />}
            fullWidth
          >
            {choice.choice}
          </Button>
        </Grid>
      ))}
    </Grid>
  );
};

export default PlayMultipleChoices;
