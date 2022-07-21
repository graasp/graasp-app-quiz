import PropTypes from 'prop-types';

import React from 'react';
import { useTranslation } from 'react-i18next';

import { Grid, TextField, Typography } from '@mui/material';

const PlayTextInput = ({ text, setText, answer, submitted }) => {
  const { t } = useTranslation();

  const answerIsCorrect = () => {
    return answer.toLowerCase() === text.toLowerCase();
  };

  return (
    <>
      <Grid container direction={'column'} alignItems="center" sx={{ p: 2 }}>
        <Grid item sx={{ pb: 2 }}>
          <Typography variant="p1">{t('Type your answer')}</Typography>
        </Grid>
        {(() => {
          if (!submitted) {
            return (
              <TextField
                value={text}
                placeholder={t('Enter Answer')}
                label={t('Answer')}
                variant="outlined"
                onChange={(t) => {
                  {
                    setText(t.target.value);
                  }
                }}
              />
            );
          }

          if (answerIsCorrect()) {
            return (
              <TextField
                label={t('Correct')}
                required
                variant="outlined"
                defaultValue={text}
                color="success"
                focused
                inputProps={{ readOnly: true }}
              />
            );
          }

          return (
            <TextField
              error
              label={t('Incorrect')}
              defaultValue={text}
              helperText={t(`Correct Answer: ${answer}`)}
              focused
              inputProps={{ readOnly: true }}
            />
          );
        })()}
      </Grid>
    </>
  );
};

PlayTextInput.propTypes = {
  text: PropTypes.string,
  setText: PropTypes.func.isRequired,
  answer: PropTypes.string,
  submitted: PropTypes.bool,
};

export default PlayTextInput;
