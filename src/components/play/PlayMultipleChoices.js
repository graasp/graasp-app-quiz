import clonedeep from 'lodash.clonedeep';

import React from 'react';

import CheckIcon from '@mui/icons-material/Check';
import { Button, Grid } from '@mui/material';

import { buildMultipleChoicesButtonCy } from '../../config/selectors';

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

  const computeStyles = ({ value, isCorrect }, idx) => {
    const isSelected = Boolean(response.choices?.includes(value));
    const dataCy = buildMultipleChoicesButtonCy(idx, isSelected);
    if (showCorrection) {
      switch (true) {
        case isCorrect && isSelected:
          return {
            color: 'success',
            variant: 'contained',
            endIcon: <CheckIcon />,
            'data-cy': dataCy,
          };
        case isCorrect && !isSelected:
          return {
            color: 'error',
            variant: 'contained',
            endIcon: <CheckIcon />,
            'data-cy': dataCy,
          };
        case !isCorrect && isSelected:
          return { color: 'error', variant: 'contained', 'data-cy': dataCy };
        default:
          return { color: 'primary', variant: 'outlined', 'data-cy': dataCy };
      }
    }

    return {
      color: 'primary',
      variant: isSelected ? 'contained' : 'outlined',
      'data-cy': dataCy,
    };
  };

  return (
    <Grid container direction="column" spacing={2}>
      {choices?.map((choice, idx) => (
        <Grid item key={choice.value}>
          <Button
            value={choice.value}
            onClick={onResponseClick}
            fullWidth
            {...computeStyles(choice, idx)}
          >
            {choice.value}
          </Button>
        </Grid>
      ))}
    </Grid>
  );
};

export default PlayMultipleChoices;
