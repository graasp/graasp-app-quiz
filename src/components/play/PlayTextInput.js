import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import CheckIcon from '@mui/icons-material/Check';
import { TextField } from '@mui/material';

import { computeCorrectness } from '../context/utilities';

const PlayTextInput = ({ values, response, setResponse, showCorrection }) => {
  const [isCorrect, setIsCorrect] = useState();
  const { t } = useTranslation();

  useEffect(() => {
    if (showCorrection) {
      setIsCorrect(computeCorrectness(response, values));
    }
  }, [showCorrection, response]);

  const computeColor = () => {
    return isCorrect ? 'success' : 'error';
  };

  return (
    <TextField
      fullWidth
      value={response.text}
      placeholder={t('Type your answer')}
      helperText={
        showCorrection && !isCorrect && t(`Correct Answer: ${values.text}`)
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
