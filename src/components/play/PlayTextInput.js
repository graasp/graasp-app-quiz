import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import CheckIcon from '@mui/icons-material/Check';
import { TextField } from '@mui/material';

import { PLAY_VIEW_TEXT_INPUT_CY } from '../../config/selectors';
import { computeCorrectness } from '../context/utilities';

const PlayTextInput = ({ values, response, setResponse, showCorrection }) => {
  const [isCorrect, setIsCorrect] = useState();
  const { t } = useTranslation();

  useEffect(() => {
    if (showCorrection) {
      setIsCorrect(computeCorrectness(values, response));
    }
  }, [showCorrection, response, values]);

  const computeColor = () => {
    return isCorrect ? 'success' : 'error';
  };

  return (
    <TextField
      data-cy={PLAY_VIEW_TEXT_INPUT_CY}
      fullWidth
      value={response.text ?? ''}
      placeholder={t('Type your answer')}
      helperText={
        showCorrection &&
        !isCorrect &&
        values.text &&
        t('Correct Answer', { answer: values.text })
      }
      label={t('Answer')}
      variant="outlined"
      onChange={(t) => {
        setResponse(t.target.value);
      }}
      color={showCorrection && computeColor()}
      InputProps={{
        endAdornment: showCorrection && isCorrect && (
          <CheckIcon color="success" />
        ),
      }}
      // set error prop only if we show the correction
      {...(showCorrection
        ? {
            error: !isCorrect,
          }
        : {})}
    />
  );
};

export default PlayTextInput;
